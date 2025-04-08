require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('../db')
const serverlese = require('serverless-http')

// const userModel = require('./Model/User')

// all router will be here
const userRouter = require('../Route/UserRoute')

const app = express()
app.use(bodyParser.json())
app.use(cors({
    origin:'http://localhost:5173'
}))

// All route initiate here
app.use('/userapi',userRouter)


module.exports = app
module.exports.handler = serverlese(app)
// const port = process.env.PORT



// app.listen(port,(req,res)=>{
//     console.log(`Server is running on : http://localhost:${port}`)
// })