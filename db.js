const mongoose = require('mongoose')
const db = "mongodb://basit:basit123@cluster0-shard-00-00.aq5iv.mongodb.net:27017,cluster0-shard-00-01.aq5iv.mongodb.net:27017,cluster0-shard-00-02.aq5iv.mongodb.net:27017/vote?ssl=true&replicaSet=atlas-uuiczk-shard-0&authSource=admin&retryWrites=true&w=majority"
const connectDB = async (array) => {
    try {
      const conn = await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex:true
      })
      console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
  
  module.exports = connectDB;