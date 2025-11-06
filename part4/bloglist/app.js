const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

app.use(express.json())

app.use('/api/blogs', middleware.tokenExtractor)

app.use('/api/users', usersRouter)

app.use('/api/blogs', blogsRouter)
