const express = require("express");
const blogRouter = express.Router();
const {
  addBlog,
  deleteBlog,
  updateBlog,
  blogLike,
  blogDislike,
  totalActions,
} = require("../controller/blogController");

// /api/blogs

blogRouter.post("/",addBlog);

blogRouter.route("/:id").delete(deleteBlog).put(updateBlog);

// Likes and DisLikes
blogRouter.put("/like/:id", blogLike);
blogRouter.put("/dislike/:id", blogDislike);
blogRouter.get("/totalActions/:id", totalActions);

module.exports = blogRouter;
