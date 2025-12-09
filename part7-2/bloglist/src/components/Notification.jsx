import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)
  if (!message) return null
  return (
    <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded mb-4">
      {message}
    </div>
  )
}
export default Notification