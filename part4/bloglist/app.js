const express = require('express')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())

app.use('/api/blogs', middleware.tokenExtractor, blogsRouter)

app.use('/api/users', usersRouter)

module.exports = app
