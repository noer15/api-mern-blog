const pollingModel = require("../models/polling");

class polling {
  async postPolling(req, res) {
    let data = req.body;
    await pollingModel
      .create(data)
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
}

module.exports = polling;
