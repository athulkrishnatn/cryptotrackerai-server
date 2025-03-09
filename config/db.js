const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING,{
            
        })
        console.log("MongoDB connected successfully")
        
    } catch (error) {
        console.log(error)
        
    }
    
} 

module.exports = connectDB