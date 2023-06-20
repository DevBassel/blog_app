const Blog = require("../models/Blog");
const { isValidObjectId, default: mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");

// Get  blogs with user id    |   GET   |   /api/blog   | private

// Add Blog   |   POST    |   /api/blog   |   private
const addBlog = asyncHandler(async (req, res) => {
  // const { tittle, content, image } = req.body;
  try {
    // console.log(req.body);
    const blog = await Blog.create({
      ...req.body,
      author: {
        id: new mongoose.Types.ObjectId(req.user._id),
        name: req.user.name,
      },
    });
    // console.log(blog);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Update Blog   |  PUT   |   /api/blog/:id   |   private
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (isValidObjectId(id)) {
    const blog = await Blog.findById(id);
    //  console.log(blog);
    if (blog.author.toString() === req.user._id.toString()) {
      await Blog.findByIdAndUpdate(id, { ...req.body });
      res.status(200).json({ sccess: true });
    } else {
      res.status(404);
      throw new Error("Blog Not Found");
    }
  } else {
    throw new Error(`[ ${id} ] isn't valid`);
  }
});

// Delete  Blog |  DELETE  |  /api/blog/:id   |   private
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (isValidObjectId(id)) {
    const blog = await Blog.findById(id);
    //  console.log(blog);
    if (blog) {
      if (blog.author.id.toString() === req.user._id.toString()) {
        await Blog.findByIdAndDelete(id);
        res.status(200).json({ sccess: true });
      }
    } else {
      res.status(404);
      throw new Error("Blog Not Found");
    }
  } else {
    throw new Error(`[ ${id} ] isn't valid`);
  }
});

// Like  Blog |  POST  |  /api/blog/like/:id   |   private
const blogLike = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  if (isValidObjectId(blogId)) {
    const blog = await Blog.findById(blogId);
    // console.log(blog);
    if (blog) {
      if (!blog.usersLikes.includes(req.user._id)) {
        await Blog.findByIdAndUpdate(blogId, {
          $push: { usersLikes: req.user._id },
          $pull: { usersDisLikes: req.user._id },
        });
        // return res.json({ success: true, msg: "like add" });
      } else {
        await Blog.findByIdAndUpdate(blogId, {
          $pull: { usersLikes: req.user._id },
        });
      }
      return res.json({ success: true });
    }
  } else {
    res.status(400);
    throw new Error("enter valid id");
  }
  res.status(404);
  throw new Error("Not found");
});

// disLike  Blog |  POST  |  /api/blog/dislike/:id   |   private
const blogDislike = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  if (isValidObjectId(blogId)) {
    const blog = await Blog.findById(blogId);
    // console.log(blog);
    if (blog) {
      if (!blog.usersDisLikes.includes(req.user._id)) {
        await Blog.findByIdAndUpdate(blogId, {
          $push: { usersDisLikes: req.user._id },
          $pull: { usersLikes: req.user._id },
        });
        // return res.json({ success: true, msg: "dis like add" });
      } else {
        await Blog.findByIdAndUpdate(blogId, {
          $pull: { usersDisLikes: req.user._id },
        });
        // return res.json({ success: true, msg: "dislike removed" });
      }
      return res.json({ success: true });
    }
  } else {
    res.status(400);
    throw new Error("enter valid id");
  }
  res.status(404);
  throw new Error("Not found");
});

// total likes and dislikes  Blog |  POST  |  /api/blog/dislike/:id   |   private
const totalActions = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  if (isValidObjectId(blogId)) {
    const blog = await Blog.findById(blogId);
    if (blog) {
      let useris = "none";
      if (blog.usersLikes.includes(req.user._id)) {
        useris = "like";
      }
      if (blog.usersDisLikes.includes(req.user._id)) {
        useris = "dislike";
      }

      return res.json({
        likes: blog.usersLikes.length,
        disLikes: blog.usersDisLikes.length,
        useris,
      });
    }
  } else {
    res.status(400);
    throw new Error("enter valid id");
  }
  res.status(404);
  throw new Error("Not found");
});

module.exports = {
  updateBlog,
  addBlog,
  deleteBlog,
  blogLike,
  blogDislike,
  totalActions,
};
