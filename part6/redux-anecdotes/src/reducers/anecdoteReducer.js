import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";


const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updated = action.payload;
      return state.map((a) => (a.id !== updated.id ? a : updated));
    },
  },
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const returnedAnecdote = await anecdoteService.update(updatedAnecdote);
    dispatch(updateAnecdote(returnedAnecdote));
  };
};

export const { updateAnecdote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
