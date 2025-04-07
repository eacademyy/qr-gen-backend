require('dotenv').config()
const jwt = require('jsonwebtoken')
const TokenBalckList = require('../Model/TokenBalckList')


const UserAuthentication = async(req,res,next)=>{
    const header = req.header('Authorization')
    if (!header || !header.startsWith('Bearer ')) {
        res.json({"token_sts":"1","msg":"No token found or Invalid"})
    } else {
        const token = header.split(' ')[1]
        
        const isBlackList = await TokenBalckList.findOne({token})
        
        if (isBlackList) {
            return res.json({"token_sts":"3","msg":"Token is Not Valid"}) 
        }

        try {
            const verified = jwt.verify(token,process.env.JWT_USER_SECRET)
            req.user = verified
            next()
        } catch (error) {
            res.json({"token_sts":"2","msg":error})
        }
    }
}

module.exports = UserAuthentication