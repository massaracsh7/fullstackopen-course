import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App'
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App store={store} />)
}

renderApp()
store.subscribe(renderApp)
