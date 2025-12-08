import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const User = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  useEffect(() => { axios.get(`/api/users/${id}`).then(res => setUser(res.data)) }, [id])
  if (!user) return null
  return (
    <div>
      <h2>{user.name}</h2>
      <ul>{user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}</ul>
    </div>
  )
}
export default User