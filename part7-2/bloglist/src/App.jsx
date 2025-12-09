import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import Menu from './components/Menu'
import Blog from './components/Blog'
import Users from './components/Users'
import Notification from './components/Notification'

const BlogCard = ({ blog, handleLike, handleDelete }) => (
  <div className="bg-white shadow-md rounded p-4 mb-4 hover:shadow-lg transition-shadow">
    <h3 className="text-xl font-bold mb-1">{blog.title}</h3>
    <p className="text-gray-600 mb-1">Author: {blog.author}</p>
    <p className="text-blue-600 underline mb-2">{blog.url}</p>
    <div className="flex items-center gap-4">
      <span className="font-semibold">Likes: {blog.likes}</span>
      <button
        onClick={() => handleLike(blog)}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        Like
      </button>
      <button
        onClick={() => handleDelete(blog)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
      <Link
        to={`/blogs/${blog.id}`}
        className="ml-auto text-blue-700 hover:underline"
      >
        View
      </Link>
    </div>
  </div>
)

const App = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    axios.get('/api/blogs').then(res => setBlogs(res.data))
  }, [])

  const handleLike = (blog) => {
    const updated = { ...blog, likes: blog.likes + 1 }
    axios.put(`/api/blogs/${blog.id}`, updated).then(res => {
      setBlogs(blogs.map(b => b.id === blog.id ? res.data : b))
    })
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Delete blog "${blog.title}"?`)) {
      axios.delete(`/api/blogs/${blog.id}`).then(() => {
        setBlogs(blogs.filter(b => b.id !== blog.id))
      })
    }
  }

  return (
    <Router>
      <div className="max-w-4xl mx-auto p-6">
        <Menu />
        <Notification />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h2 className="text-3xl font-bold mb-4">Blogs</h2>
                {blogs.map(blog => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    handleLike={handleLike}
                    handleDelete={handleDelete}
                  />
                ))}
              </div>
            }
          />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App