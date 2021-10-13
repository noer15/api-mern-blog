const express = require("express");
const router = express.Router();

const candidate = require("../controllers/candidate");
const candidateController = new candidate();

// [POST] = /api/v1/
router.post("/store/candidates", candidateController.storeCandidate);
router.get("/get-candidate", candidateController.getCandidate);

module.exports = router;
