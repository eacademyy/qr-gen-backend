require('dotenv').config()
const mongoose = require('mongoose')

// console.log("MONGODB_URI:", process.env.DB_URL); // debug log


mongoose.connect(process.env.DB_URL)

mongoose.connection.on("connected",()=>{
    console.log("MongoDB Connected")    
})

mongoose.connection.on("error",(error)=>{
    console.log(`Error is ${error}`)
})

module.exports = mongoose;