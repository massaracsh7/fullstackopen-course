import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('BlogForm calls createBlog with correct details (5.16)', async () => {
  const createBlog = vi.fn()
  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()
  const titleInput = screen.getByPlaceholderText('enter title')
  const authorInput = screen.getByPlaceholderText('enter author')
  const urlInput = screen.getByPlaceholderText('enter url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'React Testing')
  await user.type(authorInput, 'Kent C. Dodds')
  await user.type(urlInput, 'https://testing-library.com')
  await user.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React Testing',
    author: 'Kent C. Dodds',
    url: 'https://testing-library.com'
  })
})
