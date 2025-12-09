import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Blog = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    axios.get(`/api/blogs/${id}`).then(res => setBlog(res.data))
  }, [id])

  if (!blog) return null

  const handleComment = e => {
    e.preventDefault()
    axios.post(`/api/blogs/${id}/comments`, { comment }).then(res => {
      setBlog(res.data)
      setComment('')
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mb-6">
      <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
      <p className="text-gray-600 mb-1">Author: {blog.author}</p>
      <p className="text-blue-600 underline mb-3">{blog.url}</p>
      <p className="mb-4 font-semibold">Likes: {blog.likes}</p>

      <h3 className="text-xl font-semibold mb-2">Comments</h3>
      <ul className="mb-4 list-disc list-inside">
        {blog.comments.map((c, i) => <li key={i}>{c}</li>)}
      </ul>

      <form onSubmit={handleComment} className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-2 py-1"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Add</button>
      </form>
    </div>
  )
}
export default Blog