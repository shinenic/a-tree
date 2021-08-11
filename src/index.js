import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { CONTAINER_ID } from 'constants'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const createContainer = () => {
  const container = document.createElement('div')
  container.id = CONTAINER_ID
  document.body.appendChild(container)
}

createContainer()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById(CONTAINER_ID)
)
