import { createSlice } from '@reduxjs/toolkit'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => action.payload,
    addBlog: (state, action) => { state.push(action.payload) },
    likeBlog: (state, action) => {
  const id = action.payload
  const blog = state.find(b => b.id === id)
  if (blog) blog.likes += 1
},
deleteBlog: (state, action) => state.filter(b => b.id !== action.payload)
  }
})

export const { setBlogs, addBlog } = blogsSlice.actions
export default blogsSlice.reducer