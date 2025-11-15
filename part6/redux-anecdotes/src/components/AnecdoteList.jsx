import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationSlice'

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

  const filtered = anecdotes
    .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.votes - a.votes)

  const handleVote = (id, content) => {
    dispatch(voteAnecdote(id))
    dispatch(showNotification(`You voted for "${content}"`, 5))
  }

  return (
    <div>
      {filtered.map(a => (
        <Anecdote 
          key={a.id} 
          anecdote={a} 
          handleVote={() => handleVote(a.id, a.content)}
        />
      ))}
    </div>
  )
}

export default AnecdoteList
