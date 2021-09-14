const express = require("express");
const router = express.Router();

const blog = require("../controllers/blog");
const blogController = new blog();

// [POST] = /api/v1/blog/post
router.post("/post", blogController.createPostBlog);
router.get("/posts", blogController.getBlogPost);
router.get("/post/:id", blogController.getBlogId);
router.put("/post/:id", blogController.updateBlog);
router.delete("/post/:id", blogController.deleteBlog);

module.exports = router;
