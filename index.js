const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const verify = require('./routes/verify');

mongoose
  .connect("mongodb://localhost/blood-sugar-monitor", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Connection failed: ", err);
  });

app.use(express.json());
app.use(cors());
app.use('/user', userRoute);
app.use('/auth', authRoute);
app.use('/verify', verify);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});