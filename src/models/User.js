const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// literally the schema of what a user consists of
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, // email must be unique
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// rails: before_save hook
// basically salting the password from raw value to something crazy

// doing function() instead of () => {}
// because this happens to be user in mongoDB pre hook
userSchema.pre("save", function (next) {
  const user = this; // wahh??

  // if user has not modified his password in any way, then just move on
  // what counts as modified?
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// see if the password from RN matches the hashed password

// add in an instance method
// again not doing arrow function because we want to preserve 'this'

// gets called in /signin explictly
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  // candidatePassword: what the user is trying to login with

  // making our own Promise wrapper
  // so we can async await
  // bcrypt relies straight only on callbacks
  // not great; some artifact of node
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

// nothing gets exported though so I'm confused
// supposedely mongoose expects this to be required only once
/*
exactly one time if we import require this file user dot J.S. into multiple other files inside of our

project every time we require it.

That line right there is going to be executed a second or third or fourth time and you're going to very

quickly see an error message where Mongoose says something like hey you already defined a model called

user you can't define it again.
*/

mongoose.model("User", userSchema);
