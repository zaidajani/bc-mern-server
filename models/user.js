const mongoose = require('mongoose');
const Joi = require("joi");
const jsonwebtoken = require('jsonwebtoken');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  readings: {
    type: Array,
    default: []
  }
});

schema.methods.generateAuthToken = function () {
  const token = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_KEY);
  return token;
}

const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().required(),
    password: Joi.string().required()
  })

	return schema.validate(data);
}

module.exports = {
  User: mongoose.model('User', schema),
  validate
}