import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Users = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    axios.get('/api/users').then(res => setUsers(res.data))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Username</th>
            <th className="border px-4 py-2">Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                <Link className="text-blue-700 hover:underline" to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td className="border px-4 py-2 text-center">{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Users