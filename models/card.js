const mongoose = require('mongoose');
const { regExpUrl } = require('../utils/regexp/regExpUrl');
const User = require('./user');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator: (v) => regExpUrl.test(v),
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  likes: [
    {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
