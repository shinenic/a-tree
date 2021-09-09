import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { CONTAINER_ID } from 'constants'
import { QueryClient, QueryClientProvider } from 'react-query'
import SettingProvider from 'components/Setting/Context/Provider'
import GenerateTokenGuide from 'components/Tour/GenerateTokenGuide'
import { getSettingFromLocalStorage } from 'utils/setting'

const checkDomainMatched = () => {
  const host = window.location.host

  return host.includes('github')
}

const applyStyleFromLocalStorage = () => {
  const { drawerWidth } = getSettingFromLocalStorage()

  const style = document.createElement('style')
  style.innerHTML = `
    body {
      margin-left: ${drawerWidth}px !important;
    }
  `
  document.documentElement.appendChild(style)
}

const createContainer = () => {
  const container = document.createElement('div')
  container.id = CONTAINER_ID
  document.body.appendChild(container)
}

const renderExtension = () => {
  if (!checkDomainMatched()) return

  applyStyleFromLocalStorage()

  const onLoad = () => {
    const queryClient = new QueryClient()

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
  window.onload = onLoad
}

renderExtension()