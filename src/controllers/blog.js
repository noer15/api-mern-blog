const PostModel = require("../models/blog");
const fs = require("fs");
const { count } = require("../models/blog");

class blog {
  constructor() {
    //
  }
  async createPostBlog(req, res) {
    const Posting = new PostModel({
      title: req.body.title,
      image: req.file.path,
      body: req.body.body,
      author: {
        id: "13",
        name: "nuhi",
      },
    });

    await Posting.save()
      .then((result) => {
        res.status(201).json({
          message: "success create",
          data: result,
        });
      })
      .catch((err) => console.log(err));
  }

  async getBlogPost(req, res, next) {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItem;
    await PostModel.find()
      .countDocuments()
      .then((count) => {
        totalItem = count;
        return PostModel.find()
          .skip((parseInt(currentPage) - 1) * parseInt(perPage))
          .limit(parseInt(perPage));
      })
      .then((result) => {
        res.status(200).json({
          message: "success",
          data: result,
          total_page: totalItem,
          per_page: parseInt(parseInt(perPage)),
          current_page: parseInt(currentPage),
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  async getBlogId(req, res, next) {
    const id = req.params.id;
    await PostModel.findById(id)
      .then((response) => {
        res.status(200).json({
          message: "berhasil mengambil data Id",
          data: response,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  async updateBlog(req, res, next) {
    try {
      let data = {
        title: req.body.title,
        image: req.file.path,
        body: req.body.body,
      };
      const id = req.params.id;
      await PostModel.updateOne(
        {
          _id: id,
        },
        {
          $set: data,
        }
      )
        .then((result) => {
          res.status(200).json({
            message: "success di upload",
            data: data,
          });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req, res, next) {
    const id = req.params.id;
    await PostModel.findByIdAndRemove(id)
      .then((post) => {
        fs.unlinkSync(post.image);
      })
      .then((result) => {
        res.status(200).json({
          message: "success terhapus",
          data: result,
        });
      })
      .catch((error) => {
        next(error);
      });
  }
}

module.exports = blog;
