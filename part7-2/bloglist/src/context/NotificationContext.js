import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()
const reducer = (state, action) => {
  switch(action.type){
    case 'SET': return action.payload
    case 'CLEAR': return ''
    default: return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, '')
  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)