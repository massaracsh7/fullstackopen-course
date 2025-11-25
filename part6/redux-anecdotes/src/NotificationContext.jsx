import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'HIDE':
      return ''
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [message, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={{ message, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotificationValue must be used within NotificationContextProvider')
  return context
}

export default NotificationContext
