const express = require('express')
const blogsRouter = require('./controllers/blogs')

const app = express()
const usersRouter = require('./controllers/users')

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app