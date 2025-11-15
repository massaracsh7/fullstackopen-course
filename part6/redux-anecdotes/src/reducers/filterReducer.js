const SET_FILTER = 'SET_FILTER'

export const setFilter = (filter) => {
  return {
    type: SET_FILTER,
    payload: filter
  }
}

const initialState = ''

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER:
      return action.payload
    default:
      return state
  }
}

export default filterReducer
