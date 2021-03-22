const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

// middleware:
/*
This is a function that's going to take an incoming request and do some kind of pre processing on it.
*/
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer laksjdflaksdjasdfklj'
  // add a header in POSTMAN
  // Key: Authorization // express downcases every header name
  // Value: Bearer ajskdlfjasdfqweqw

  if (!authorization) {
    // 401: forbidden
    return res.status(401).send({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");

  // does the hashed token match MY_SECRET_KEY?
  // if so unhash it all and give 'em the good stuff under payload
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in." });
    }

    const { userId } = payload;

    // find the user
    const user = await User.findById(userId);
    req.user = user; // req.user??
    // the req carries over from middleware to index.js
    // then move on
    next();
  });
};
