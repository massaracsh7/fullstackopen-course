const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const middleware = require("../utils/middleware")

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post("/", middleware.userExtractor, async (req, res) => {
  const user = req.user
  const body = req.body

  const blog = new Blog({
    ...body,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)

  if (!blog) return res.status(404).json({ error: "blog not found" })
  if (blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: "unauthorized" })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put("/:id", async (req, res) => {
  const updatedBlog = req.body

  const blog = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {
    new: true,
  })

  res.json(blog)
})

module.exports = blogsRouter
