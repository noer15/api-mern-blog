const express = require("express");
const router = express.Router();

const polling = require("../controllers/polling");
const pollingController = new polling();

// [POST] = /api/v1/polling/
router.post("/posts-polling", pollingController.postPolling);
router.get("/get-polling", pollingController.getPollingStatistic);

module.exports = router;
