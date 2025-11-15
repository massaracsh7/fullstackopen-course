import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleVote }) => (
  <div>
    <div>{anecdote.content}</div>
    <div>
      votes {anecdote.votes}
      <button onClick={handleVote}>vote</button>
    </div>
  </div>
)

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filter = useSelector(state => state.filter)
  const anecdotes = useSelector(state => state.anecdotes)

  const filteredAnecdotes = anecdotes
    .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {filteredAnecdotes.map(anecdote => (
        <Anecdote 
          key={anecdote.id} 
          anecdote={anecdote} 
          handleVote={() => dispatch(voteAnecdote(anecdote.id))}
        />
      ))}
    </div>
  )
}

export default AnecdoteList
