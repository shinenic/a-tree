import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { CONTAINER_ID } from 'constants'
import { QueryClient, QueryClientProvider } from 'react-query'
import SettingProvider from 'components/Setting/Context/Provider'
import GenerateTokenGuide from 'components/Tour/GenerateTokenGuide'
import {
  getSettingFromLocalStorage,
  storeSettingIntoLocalStorage,
} from 'utils/setting'
import { GLOBAL_MESSAGE_TYPE, CONTEXT_MENU_ITEM_ID } from 'constants'
import { reject } from 'lodash'

window.chrome.runtime.onMessage.addListener(({ type, payload }) => {
  if (type === GLOBAL_MESSAGE_TYPE.ON_CONTEXT_MENU_CLICKED) {
    const { menuItemId } = payload
    const prevState = getSettingFromLocalStorage()
    const host = window.location.host

    switch (menuItemId) {
      case CONTEXT_MENU_ITEM_ID.ENABLE_EXTENSION:
        storeSettingIntoLocalStorage({
          ...prevState,
          domains: [...new Set([...(prevState.domains || []), host])],
        })
        break
      case CONTEXT_MENU_ITEM_ID.DISABLE_EXTENSION:
        storeSettingIntoLocalStorage({
          ...prevState,
          domains: reject(prevState.domains, (domain) => domain === host),
        })
        break
      default:
        return
    }

    window.location.reload()
  }
})

const checkDomainMatched = (domains) => {
  const host = window.location.host

  return domains.includes(host) || host === 'github.com'
}

const applyStyleFromLocalStorage = (drawerWidth) => {
  const style = document.createElement('style')
  style.innerHTML = `
    html {
      margin-left: ${drawerWidth}px;
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
  const { drawerWidth, domains } = getSettingFromLocalStorage()

  if (!checkDomainMatched(domains)) return

  applyStyleFromLocalStorage(drawerWidth)

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
