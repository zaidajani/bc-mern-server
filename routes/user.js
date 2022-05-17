const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require('bcrypt');
const auth = require('./../middlewares/auth');
const _ = require('lodash');
const Joi = require('joi');

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(409).send("user with this email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    age: req.body.age,
    password: hashedPassword,
    readings: []
  });

  await newUser.save();

  res.send(_.pick(newUser, 'username', 'firstName', 'lastName', 'email', 'age'));
});

router.post('/new-reading', auth, async (req, res) => {
  const { error } = validateNewReading(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userObj = await User.findById(req.user._id);
  const readingsArr = userObj.readings;

  const reading = {
    type: req.body.type,
    level: req.body.level,
    at: new Date
  }

  readingsArr.push(reading);

  const updatedUser = {
    username: userObj.username,
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    email: userObj.email,
    age: userObj.age,
    password: userObj.password,
    readings: readingsArr
  };

  const done = await User.findByIdAndUpdate(req.user._id, updatedUser, {
    new: true
  });

  res.send(_.pick(done, 'readings'));
});

router.get('/readings', auth, async (req, res) => {
  let userObj = await User.findById(req.user._id);
  res.send(userObj.readings);
});

router.get('/userdata', auth, async (req, res) => {
  let userObj = await User.findById(req.user._id);
  res.send(_.pick(userObj, ['firstName', 'lastName', 'username', 'email', 'age', 'readings']));
})

const validateNewReading = (reading) => {
  const schema = Joi.object({
    type: Joi.string().required(),
    level: Joi.number().required()
  });

  return schema.validate(reading);
}

module.exports = router;