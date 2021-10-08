const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

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

// images
app.use("/images", express.static(__dirname + "/images")); //Serves resources from public folder

mongoose
  .connect(
    "mongodb+srv://noer15:LtKWs9zHeDbhrRpN@cluster0.kfrnb.mongodb.net/mern-blog?retryWrites=true&w=majority"
  )
  .then(() => {
    let port = 5000;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
      console.log("mongodb connect");
    });
  })
  .catch((err) => {
    console.log(err);
  });
