const pollingModel = require("../models/polling");
const { Parser } = require("json2csv");
const json2csvParser = new Parser();

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

  async getDataPolling(req, res) {
    await pollingModel
      .aggregate([
        {
          $lookup: {
            from: "candidates",
            localField: "name_candidate",
            foreignField: "_id",
            as: "candidate",
          },
        },
      ])
      .then((item) => {
        return res.json({
          data: item,
        });
      })
      .catch((e) => console.log(e));
  }

  async backupPolling(req, res, next) {
    await pollingModel
      .aggregate([
        {
          $lookup: {
            from: "candidates",
            localField: "name_candidate",
            foreignField: "_id",
            as: "candidate",
          },
        },
      ])
      .then((result) => {
        let data = [];
        result.map((item) => {
          data.push({
            name: item.name,
            company: item.company,
            phone: item.phone,
            candidate: item.candidate[0].name,
            date: formatDate(item.createdAt),
          });
        });
        const csv = json2csvParser.parse(data);
        res.send(csv);
      })
      .catch((e) => {
        next(e);
      });
  }
}

function formatDate(value) {
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  let date = new Date(value).toLocaleString("id-ID", options);
  return date;
}

module.exports = polling;
