const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    require: true
  },
  awsToken: {
    type: String,
    default: null,
  },
  tokenExpiry: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('User', UserSchema);