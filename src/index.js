// this require syntax is throwing me off
// mongoose needs to fire exactly once
// then everything can be called like const Track = mongoose.model("Track"); so
require("./models/User"); // only gets called at index just once
require("./models/Track");
const express = require("express");
const mongoose = require("mongoose"); // connects to mongoDB
// const bodyParser = require("body-parser"); // built in?
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

// https://stackoverflow.com/questions/62396498/tslint-marks-body-parser-as-deprecated
app.use(express.json()); // this line is still absolutely clutch
// this is how express knows that you are dealing with json
// Content-Type application/json
// app.use(bodyParser.json()); // deprecated; now built into !
app.use(authRoutes); // both /signup and /signin are in here; just a cleaner syntax
app.use(trackRoutes);

// https://www.udemy.com/course/the-complete-react-native-and-redux-course/learn/lecture/15708108#notes
// definitely some stuff I have to customize
// must go to cloud.mongodb.com and follow through some steps to set up a cluster
const mongoUri =
  "mongodb+srv://admin:passwordpassword@cluster0.xniyd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(mongoUri, {
  useNewUrlParser: true, // not that interesting...to prevent error messages and warnings
  useCreateIndex: true, //
});

// when successfully connected to mongo db
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

// error handling
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

// anytime someone hits our root route, run the middleware requireAuth
app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
