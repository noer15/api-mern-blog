const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
var MONGODB_URL = process.env.MONGODB_URL;

const app = express();
app.use(cors());

// upload img
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// middleware
app.use(bodyParser.json()); //type JSON
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// auth
const authRoutes = require("./src/routes/auth");
app.use("/api/v1/auth", authRoutes);

// data blog
const blogRoutes = require("./src/routes/blog");
app.use("/api/v1/blog", blogRoutes);

// data polling
const pollingRoutes = require("./src/routes/polling");
app.use("/api/v1/polling", pollingRoutes);

// data candidate
const candidateRoute = require("./src/routes/candidate");
app.use("/api/v1", candidateRoute);

// images
app.use("/images", express.static(__dirname + "/images")); //Serves resources from public folder

var port = process.env.PORT || 5000;
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
      console.log("mongodb connect");
    });
  })
  .catch((err) => {
    console.log(err);
  });
