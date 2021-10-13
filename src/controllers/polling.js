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

  async getPollingStatistic(req, res) {
    let condition = [
      {
        $match: {
          $and: [
            {
              createdAt: {
                $gte: new Date(req.query.start_date + " 00:00:00"),
                $lt: new Date(req.query.end_date + " 23:59:59"),
              },
            },
          ],
        },
      },
      {
        $unwind: "$createdAt",
      },

      {
        $lookup: {
          from: "candidates",
          localField: "name_candidate",
          foreignField: "_id",
          as: "userRole",
        },
      },
      {
        $unwind: "$userRole",
      },
      {
        $group: {
          _id: "$name_candidate",
          total: { $sum: 1 },
          admin: { $max: "$userRole.name" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          admin: 1,
          total: 1,
        },
      },
    ];

    await pollingModel
      .aggregate(condition)
      .then((result) => {
        let data = [];
        result.map((item) => {
          data.push({
            pengguna: item.admin,
            total: item.total,
          });
        });
        return res.status(200).json({
          message: "Data Berhasil Diambil",
          data: data,
        });
      })
      .catch((error) => {
        return res.status(401).json({ message: error.message });
      });
  }
}

module.exports = polling;
