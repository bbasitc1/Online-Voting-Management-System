const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:{
      type:String,
      required:true
  },
  regNo:{
    type:Number,
    required:true
  },
  voteCounts:{
      type: Number,
      default:0
  }
});

const candidate = mongoose.model('candidate', UserSchema);

module.exports = candidate;