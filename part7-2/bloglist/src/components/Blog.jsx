import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid 1px',
    marginBottom: 5
  }

  const toggleVisibility = () => setVisible(!visible)

  const showRemoveButton = currentUser?.username === blog.user?.username

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={onLike}>like</button>
          </div>
          <div>{blog.user?.name}</div>

          {showRemoveButton && (
            <button onClick={onRemove} style={{ color: 'white', background: 'red' }}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
