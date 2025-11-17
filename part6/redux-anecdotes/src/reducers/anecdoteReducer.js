import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


// const getId = () => Math.floor(Math.random() * 100000)

// const asObject = anecdote => ({
//   content: anecdote,
//   id: getId(),
//   votes: 0
// })

// const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
        setAnecdotes(state, action) {
      return action.payload
    },
    createAnecdote: (state, action) => {
      state.push({
        content: action.payload,
        id: getId(),
        votes: 0
      })
    },
    voteAnecdote: (state, action) => {
      const id = action.payload
      const anecdote = state.find(a => a.id === id)
      if (anecdote) {
        anecdote.votes += 1
      }
    }
  }
})

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const { createAnecdote, voteAnecdote, setAnecdotes  } = anecdoteSlice.actions
export default anecdoteSlice.reducer
