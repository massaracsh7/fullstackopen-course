import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({ username, password })

    window.localStorage.setItem(
      'user',
      JSON.stringify(user)
    )

    setUser(user) 
    setUsername('')
    setPassword('')
  } catch (error) {
    console.error('wrong credentials')
  }
}

useEffect(() => {
  const loggedUser = window.localStorage.getItem('user')
  if (loggedUser) {
    const user = JSON.parse(loggedUser)
    setUser(user)
    blogService.setToken(user.token)
  }
}, [])

const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogAppUser') 
  setUser(null) 
}

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
      <p>{user.name} logged in</p><button onClick={handleLogout}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
