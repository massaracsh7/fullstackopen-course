import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const handleComment = (e) => {
    e.preventDefault();
    axios.post(`/api/blogs/${blog.id}/comments`, { comment }).then((res) => {
      setBlog(res.data);
      setComment('');
    });
  };
  useEffect(() => {
    axios.get(`/api/blogs/${id}`).then((res) => setBlog(res.data));
  }, [id]);
  if (!blog) return null;
  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.author}</p>
      <p>{blog.url}</p>
      <p>Likes: {blog.likes}</p>
      <ul>
        {blog.comments.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
      <form onSubmit={handleComment}>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">Add comment</button>
      </form>
    </div>
  );
};
export default Blog;
