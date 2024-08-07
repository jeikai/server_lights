const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String }, 
  DOB: { type: Date },
  address: {type: String}
}); 

const User = mongoose.model('User', userSchema);
 
module.exports = User;