const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post('/', async (req, res) => {
  const token = req.header("x-auth-token");

  try {
    jwt.verify(token, process.env.JWT_KEY);
    res.send({"message": "success"});
  } catch (ex) {
    res.send("invalid Token");
  }
})

module.exports = router