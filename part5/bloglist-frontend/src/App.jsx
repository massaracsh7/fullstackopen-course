import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const showNotification = (message, duration = 5000) => {
  setNotification(message)
  setTimeout(() => {
    setNotification(null)
  }, duration)
}

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('user')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    blogService.setToken(user.token)
    setUsername('')
    setPassword('')
    showNotification(`Welcome ${user.name}!`)
  } catch (error) {
    showNotification('Wrong username or password')
    console.error('wrong credentials')
  }
}

  const handleLogout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
  }

const addBlog = async (event) => {
  event.preventDefault()
  try {
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

    showNotification(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added!`)
  } catch (error) {
    showNotification('Error creating blog')
    console.error('Error creating blog', error)
  }
}

  const blogForm = () => (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
        </div>
        <div>
          author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
        </div>
        <div>
          url: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )



  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      {blogForm()}

      <ul>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </ul>
    </div>
  )
}

export default App
