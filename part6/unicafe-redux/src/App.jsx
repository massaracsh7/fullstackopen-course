import React from 'react'

const App = ({ store }) => {
  const state = store.getState()

  const handleClick = (type) => {
    store.dispatch({ type })
  }

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => handleClick('GOOD')}>good</button>
      <button onClick={() => handleClick('OK')}>ok</button>
      <button onClick={() => handleClick('BAD')}>bad</button>
      <button onClick={() => handleClick('RESET')}>reset stats</button>

      <h2>statistics</h2>
      <div>good {state.good}</div>
      <div>ok {state.ok}</div>
      <div>bad {state.bad}</div>
      <div>all {state.good + state.ok + state.bad}</div>
      <div>average {(state.good - state.bad) / (state.good + state.ok + state.bad) || 0}</div>
      <div>positive {((state.good / (state.good + state.ok + state.bad)) * 100 || 0).toFixed(1)} %</div>
    </div>
  )
}

export default App
