import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { CONTAINER_ID } from 'constants'
import { QueryClient, QueryClientProvider } from 'react-query'
import SettingProvider from 'components/Setting/Context/Provider'
import GenerateTokenGuide from 'components/Tour/GenerateTokenGuide'

const queryClient = new QueryClient()

const createContainer = () => {
  const container = document.createElement('div')
  container.id = CONTAINER_ID
  document.body.appendChild(container)
}

const renderExtension = () => {
  createContainer()

  ReactDOM.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SettingProvider>
          <GenerateTokenGuide />
          <App />
        </SettingProvider>
      </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById(CONTAINER_ID)
  )
}

/**
 * @TODO Handle margin of `body` for width of drawer
 */
window.onload = renderExtension
