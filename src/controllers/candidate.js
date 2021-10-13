const candidateModel = require("../models/candidate");

class candidate {
  async storeCandidate(req, res) {
    await candidateModel
      .create(req.body)
      .then((result) => {
        return res.status(200).json({
          message: "success",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(401).json({
          message: e,
        });
      });
  }

  async getCandidate(req, res, next) {
    await candidateModel
      .find()
      .then((item) => {
        return res.status(200).json({
          message: "success",
          data: item,
        });
      })
      .catch((e) => {
        next(e);
      });
  }
}

module.exports = candidate;
