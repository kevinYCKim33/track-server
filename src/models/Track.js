const mongoose = require("mongoose");
// mongoose is what we use to interact with MongoDB
// sort of like activeRecord for PostregeSQL

// oh dang Types!!
const pointSchema = new mongoose.Schema({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  },
});
const trackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    default: "",
  },
  locations: [pointSchema],
});

mongoose.model("Track", trackSchema);
