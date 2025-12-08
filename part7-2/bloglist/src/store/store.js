import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './notificationSlice'
import blogsReducer from './blogsSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: userReducer
  }
})