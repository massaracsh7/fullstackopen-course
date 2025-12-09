import { Link } from 'react-router-dom'

const Menu = () => (
  <nav className="bg-blue-100 p-4 rounded mb-6">
    <Link className="mr-4 text-blue-800 hover:underline" to="/">Blogs</Link>
    <Link className="text-blue-800 hover:underline" to="/users">Users</Link>
  </nav>
)
export default Menu
