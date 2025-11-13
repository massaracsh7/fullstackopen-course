import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Testing React Components',
  author: 'Dan Abramov',
  url: 'https://react.dev',
  likes: 42,
  user: { username: 'mluukkai', name: 'Matti Luukkainen', id: 'user123' }
}

test('renders title and author, but not url or likes by default (5.13)', () => {
  render(<Blog blog={blog} />)

expect(screen.getByText(/Testing React Components/i)).toBeDefined()
expect(screen.getByText(/Dan Abramov/i)).toBeDefined()

  expect(screen.queryByText('https://react.dev')).toBeNull()
  expect(screen.queryByText(/likes/i)).toBeNull()
})

test('shows url and likes after clicking the view button (5.14)', async () => {
  render(<Blog blog={blog} />)
  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  expect(screen.getByText('https://react.dev')).toBeDefined()
  expect(screen.getByText(/likes 42/i)).toBeDefined()
})

test('clicking like twice calls event handler twice (5.15)', async () => {
  const mockLikeHandler = vi.fn()
  render(<Blog blog={blog} onLike={mockLikeHandler} />)
  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})
