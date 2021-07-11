import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { CONTAINER_ID } from 'constants'

const createContainer = () => {
  const container = document.createElement('div')
  container.id = CONTAINER_ID
  document.body.appendChild(container)
}

createContainer()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById(CONTAINER_ID)
)
