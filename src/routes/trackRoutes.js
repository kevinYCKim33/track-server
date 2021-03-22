const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Track = mongoose.model("Track");

const router = express.Router();

// oh dang middleware!
// anything below here now needs to be JWT approved now
router.use(requireAuth);

router.get("/tracks", async (req, res) => {
  // hmm subtle but important; req.user is already available via login
  const tracks = await Track.find({ userId: req.user._id }); // why underscore??

  res.send(tracks);
});

router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;

  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "You must provide a name and locations" });
  }

  try {
    const track = new Track({ name, locations, userId: req.user._id });
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

// oh subtle this needs to be required in from the index
module.exports = router;
