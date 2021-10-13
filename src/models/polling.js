const mongoose = require("mongoose");

const Polling = mongoose.Schema(
  {
    name: String,
    company: String,
    phone: String,
    name_candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("polling", Polling);
