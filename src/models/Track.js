const mongoose = require("mongoose");
// mongoose is what we use to interact with MongoDB
// sort of like activeRecord for PostregeSQL

// oh dang Types!!
const pointSchema = new mongoose.Schema({
  timestamp: Number, // odd that it's not string or date
  // coords is an object: nice nosql
  // this matches exactly from React Native mobile location app
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  },
});

// oh woah...trackSchema takes in pointSchema
// a Track has many Points
// a track belongs to a User
// and a name
// and locations made up of points
const trackSchema = new mongoose.Schema({
  userId: {
    // This is how we indicate that user I.D. is a reference to some other object stored inside of Mongo DB.
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // used by mongoose; user id is pointing at an instance of User
  },
  name: {
    type: String,
    default: "", // for a weird case of someone not naming their tracks
  },
  locations: [pointSchema], // hmm I wish it was written like pointSchema[]
});

mongoose.model("Track", trackSchema);
