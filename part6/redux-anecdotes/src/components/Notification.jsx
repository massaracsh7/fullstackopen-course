import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const { message } = useNotificationValue()

  if (!message) return null

  return (
    <div style={{ border: '1px solid', padding: 10, marginBottom: 10 }}>
      {message}
    </div>
  )
}

export default Notification
