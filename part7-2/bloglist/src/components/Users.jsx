import { useEffect, useState } from 'react'
import axios from 'axios'

const Users = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    axios.get('/api/users').then(res => setUsers(res.data))
  }, [])
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead><tr><th>Username</th><th>Blogs created</th></tr></thead>
        <tbody>
          {users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.blogs.length}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
export default Users