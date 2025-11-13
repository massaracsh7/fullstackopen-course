import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef();

  const showNotification = (message, duration = 5000) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("user");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
      showNotification(`Welcome ${user.name}!`);
    } catch (error) {
      showNotification("Wrong username or password");
      console.error("wrong credentials");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
  };

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user,
      };

      const returnedBlog = await blogService.update(blog.id, updatedBlog);

      const fixedBlog = {
        ...returnedBlog,
        user: blog.user,
      };

      setBlogs(blogs.map((b) => (b.id === blog.id ? fixedBlog : b)));
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      blogFormRef.current.toggleVisibility();
      showNotification(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added!`
      );
    } catch (error) {
      showNotification("Error creating blog");
      console.error("Error creating blog", error);
    }
  };

  const handleRemove = async (blog) => {
  const confirm = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
  if (!confirm) return

  try {
    await blogService.remove(blog.id)
    setBlogs(blogs.filter(b => b.id !== blog.id))
    showNotification(`Blog "${blog.title}" removed`)
  } catch (error) {
    showNotification('Error removing blog')
    console.error('Error removing blog', error)
  }
}

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
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
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />

      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <ul>
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              onLike={() => handleLike(blog)}
              onRemove={() => handleRemove(blog)}
              currentUser={user}
            />
          ))}
      </ul>
    </div>
  );
};

export default App;
