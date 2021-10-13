const mongoose = require("mongoose");

const Candidate = mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("candidate", Candidate);
