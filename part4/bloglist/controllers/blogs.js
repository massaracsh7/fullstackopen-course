const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  try {
    const body = request.body;

    const users = await User.find({});
    const user = users[0];

    if (!user) {
      return response.status(400).json({ error: "no users in database" });
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
    if (error.name === "ValidationError") {
      return response.status(400).json({ error: error.message });
    }
    response.status(500).json({ error: "Error" });
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
