const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User"); // anytime you want to refer to the User
// you do this instead
// muscle memory: wants you to do something like...
// import {User} from src/models/Users but mongoose doesn't work like that
// import once at index.js with require
// and reference it via User = mongoose.model("User")

const router = express.Router();

// any post request to sign up it does what's in this body
// big picture:
// hit signup post route with a body containing email and password
router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  // go to the catch block if anything here errors out
  try {
    // rails user = User.new(user_params)
    // if (user.save)
    const user = new User({ email, password });
    await user.save(); // this may error out if any of these are invalid
    // cloud.mongodb.com => clusters => collections => the user is actually in there!
    // I'm doing nosql!
    // validation runs on user.save from mongoose to mongodb

    // userId is what we want to encode
    // hey hash userId under MY_SECRET_KEY
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token }); // where does the react native app hold onto the JWT?
  } catch (err) {
    return res.status(422).send(err.message);
    // 422: unprocessable entity
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

module.exports = router;
