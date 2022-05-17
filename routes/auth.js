const router = require("express").Router();
const { User } = require("./../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("User does not exist");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(401).send("Invalid Password");

  const token = await user.generateAuthToken();
  res.status(200).send({ token: token });
});

const validate = (entry) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate(entry);
};

module.exports = router;
