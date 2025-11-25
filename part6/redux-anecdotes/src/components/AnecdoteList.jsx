import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from '../services/anecdotes'
import { useNotificationValue } from '../NotificationContext'

const AnecdoteList = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotificationValue()

  const { data: anecdotes, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const updateMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const notes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        notes.map(a => (a.id === updatedAnecdote.id ? updatedAnecdote : a))
      )
      dispatch({ type: 'SHOW', payload: `You voted for: "${updatedAnecdote.content}"` })
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000)
    }
  })

  const handleVote = (anecdote) => {
    updateMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  if (isLoading) return <div>Loading anecdotes...</div>
  if (isError) return <div>Anecdote service not available</div>

  return (
    <div>
      {anecdotes.map(a => (
        <div key={a.id}>
          <div>
            {a.content} <strong>votes: {a.votes}</strong>
          </div>
          <button onClick={() => handleVote(a)}>vote</button>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
