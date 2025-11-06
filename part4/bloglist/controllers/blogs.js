const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

const { getTokenFrom } = require("../utils/list_helper");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  try {
    const body = request.body;
    const token = getTokenFrom(request);

    if (!token) {
      return response.status(401).json({ error: "token missing" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return response.status(401).json({ error: "token invalid" });
    }

    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(401).json({ error: "user not found" });
    }

    const blog = new Blog({
      ...body,
      user: user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "internal server error" });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = request.body;

  const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
  });

  response.json(blog);
});

module.exports = blogsRouter;
