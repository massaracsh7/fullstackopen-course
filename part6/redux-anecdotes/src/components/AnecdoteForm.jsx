import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdotes'
import { useNotificationValue } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotificationValue()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || []
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      dispatch({ type: 'SHOW', payload: `Anecdote added: "${newAnecdote.content}"` })
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000)
    },
    onError: (error) => {
      dispatch({ type: 'SHOW', payload: `Error: ${error.message}` })
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000)
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < 5) {
      dispatch({ type: 'SHOW', payload: 'Error: anecdote must be at least 5 characters long' })
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000)
      return
    }
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
