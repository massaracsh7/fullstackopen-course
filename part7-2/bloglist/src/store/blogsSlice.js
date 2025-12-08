import { createSlice } from '@reduxjs/toolkit'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => action.payload,
    addBlog: (state, action) => { state.push(action.payload) }
  }
})

export const { setBlogs, addBlog } = blogsSlice.actions
export default blogsSlice.reducer