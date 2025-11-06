const assert = require('node:assert')
const { test, describe, before, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')
const bcrypt = require('bcryptjs')

const api = supertest(app)
let mongoServer
let token
let testUser

before(async () => {
  process.env.SECRET = 'secret'

  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)

  testUser = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash
  })
  await testUser.save()

  token = jwt.sign(
    { username: testUser.username, id: testUser._id },
    process.env.SECRET
  )

  const blogsWithUser = helper.initialBlogs.map(b => ({ ...b, user: testUser._id }))
  await Blog.insertMany(blogsWithUser)
})

describe('when there are some blogs initially', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const blogsAtStart = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)
  })

  test('unique identifier of the blog posts is named id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blog = blogsAtStart[0]
    assert(blog.id)
    assert(!blog._id)
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Testing blog',
      author: 'User_test',
      url: 'https://testblog.com/testing-blog',
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Testing blog'))
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Without likes',
      author: 'User_test',
      url: 'https://example.com/no-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'User_test',
      url: 'https://testblog.com/no-title',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'No URL',
      author: 'User_test',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with 401 Unauthorized if token is not provided', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'User_test',
      url: 'https://example.com/no-token',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test('succeeds in updating likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = { likes: blogToUpdate.likes + 1 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})
