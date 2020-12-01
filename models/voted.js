const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id:{
      type:String,
      required:true
  }
});

const voted = mongoose.model('voted', UserSchema);

module.exports = voted;