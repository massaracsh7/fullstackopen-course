const userReducer = (state, action) => {
  switch(action.type){
    case 'SET': return action.payload
    case 'CLEAR': return null
    default: return state
  }
}
const UserContext = createContext()
export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)
  return <UserContext.Provider value={{ user, dispatch }}>{children}</UserContext.Provider>
}
export const useUser = () => useContext(UserContext)