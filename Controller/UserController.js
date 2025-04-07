require('dotenv').config()
const UserModel = require('../Model/User')
const LinqQRModel = require('../Model/LinkQr')
const ResetPassModel = require('../Model/ResetPass')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const TokenBalckListModel = require('../Model/TokenBalckList')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS
//     }
// })


exports.testuser = async(req,res)=>{
    res.json({
        "msg":"This is just test User"
    })
}

exports.addlinkqr = async(req,res)=>{
    const qrlink = req.body.qrlink
    const qrcolor = req.body.qrcolor
    const user = req.user.id

    try {
        const newLikQR = new LinqQRModel({
            qrlink,
            qrcolor,
            user
        })

        const saveQR = await newLikQR.save()
        res.json(saveQR) 
    } catch (error) {
        res.json({"error":error})
    }

}

exports.getqrlinks = async(req,res)=>{
    try {
        const qrlinks = await LinqQRModel.find({user:req.user.id})
        res.json(qrlinks)
    } catch (error) {
        res.json({"error":error})
    }
}

// http://localhost:5000/deleteqr/qrid

exports.deleteqr = async(req,res)=>{
    const {qrid} = req.params
    try {
        const deleteQr = await LinqQRModel.findByIdAndDelete(qrid)
        if (deleteQr) {
            res.json({"deletests":"0","msg":"QR has Deleted"})
        } else {
            res.json({"deletests":"1","msg":"QR has not Deleted"})            
        }
    } catch (error) {
        res.json({"error":error})
    }
}

exports.editqr = async(req,res)=>{
    const {qrid} = req.params
    const qrlink = req.body.qrlink
    const qrcolor = req.body.qrcolor
    try {
        const updateQr = await LinqQRModel.findByIdAndUpdate(
            qrid,
            {qrlink,qrcolor},
            {new:true}
        )

        res.json(updateQr)
    } catch (error) {
        res.json({"error":error})
    }
}


exports.reguser = async(req,res)=>{
    const uname = req.body.uname
    const upass = await bcrypt.hash(req.body.pass,12)
    const uemail = req.body.email

    try {
        const newUser = new UserModel({
            "user_name":uname,
            "user_email":uemail,
            "user_pass":upass
        })

        const saveUser = await newUser.save()
        res.json({saveUser})
    } catch (error) {
        res.json({"error":error})
    }
}

exports.loginuser = async(req,res)=>{
    const uemail = req.body.uemail
    const upass = req.body.upass

    try {
        const userLogin = await UserModel.findOne({"user_email":uemail})

        if (!userLogin) {
            res.json({"loginsts":"1","msg":"User not found"})
        } else {
            const isMatch = await bcrypt.compare(upass,userLogin.user_pass)

            if (!isMatch) {
                res.json({"loginsts":"2","msg":"Password you endtered is wrong"})
            } else {
                const token = jwt.sign(
                    {id:userLogin._id,user_email:userLogin.user_email},
                    process.env.JWT_USER_SECRET,
                    {expiresIn:'30m'}
                )

                res.json({"loginsts":"0","token":token})
            }
        }
    } catch (error) {
        res.json({"error":error})
    }
}

exports.logoutuser = async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1]
    
    if (!token) {
        res.json({"msg":"No token Found"})
    }

    try {
        const tokenData = new TokenBalckListModel(
            {token}
        )
        const saveBlcToken = await tokenData.save()
        res.json(saveBlcToken)
    } catch (error) {
        res.json({"error":error})
    }
}

exports.forgetpass = async(req,res)=>{
    const user_email = req.body.email
    try {
        const user = await UserModel.findOne({user_email})

        if (!user) {
            return res.json({"msg":"User not found"})
        }

        const token = crypto.randomBytes(32).toString("hex")



        await ResetPassModel.deleteMany({userId:user._id})

        const newReset = new ResetPassModel({
            userId:user._id,
            reset_token:token
        })

        await newReset.save()

        const resetLink = `${process.env.CLIENT_URL}/reset-pass/${token}`
        // await transporter.sendMail({
        //     to:user.user_email,
        //     subject:" QR Genrator Forget Password Link",
        //     html:`
        //         <h1>Click the link below to reset Password</h1>
        //         <a href="${resetLink}">${resetLink}</a>
        //     `
        // })
        res.json({"msg":"Reset Password link set to your Email","reset_link":resetLink})
    } catch (error) {
        res.json({"error":error})
    }
}


// http://localhost:5000/reset-pass/ererejhcu56
exports.resetpass = async(req,res)=>{

    const {token} = req.params
    const user_pass = req.body.password

    try {
        const resetToken = await ResetPassModel.findOne({"reset_token":token})

        if (!resetToken) {
            return res.json({"reststs":"1","msg":"Invalid or Expiered Link"})
        }

        const upass = await bcrypt.hash(user_pass,12)

        const resetPass = await UserModel.findOneAndUpdate(
            {_id:resetToken.userId},
            {$set:
                {user_pass:upass}
            },
            {new:true}
        )
        await ResetPassModel.deleteMany({"reset_token":token})

        res.json({"reststs":"0","msg":"Your Password Updated Successfull"})
    } catch (error) {
        res.json({"error":error})
    }
}