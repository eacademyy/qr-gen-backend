require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const serverless = require('serverless-http')
const db = require('../db')
const userRouter = require('../Route/UserRoute')

const app = express()
app.use(bodyParser.json())
app.use(cors({
    origin:'https://ultimateqr.eacademyy.in'
}))

// All route initiate here
app.use('/userapi',userRouter)


module.exports = app
module.exports.handler = serverless(app)

