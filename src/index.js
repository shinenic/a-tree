import TokenPageGuides from 'components/Guide/TokenPage'
import { CONTAINER_ID, isLocalMode } from 'constants/base'
import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import listenContextMenu from 'utils/contextMenuListener'
import { getPageInfo } from 'utils/github'
import { getSettingFromLocalStorage } from 'utils/setting'
import { SettingModal } from 'components/Setting'
import MainThemeProvider from 'styles/Provider'

import App from './App'

/**
 * @FIXME
 * If we want to use `cypress` to test the extension,
 * need to notice that cypress test the target window in a `iframe`,
 * so all of the dom operations & queries have to be done in the `iframe`.
 *
 * (This is a sample solution)
 */
const handleCypressTesting = () => {
  const iframeWindow = window.document
    .querySelector('iframe')
    .contentWindow.document.createElement('div')

  // eslint-disable-next-line
  window._window = iframeWindow
  // eslint-disable-next-line
  window._document = iframeWindow.document
}

const checkDomainMatched = (domains) => {
  const { host } = window.location

  return domains.includes(host) || host === 'github.com'
}

const appendGlobalStyle = (drawerPinned, drawerWidth) => {
  if (!drawerPinned) return

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
  const { drawerWidth, domains, disablePageTypeList, drawerPinned } =
    getSettingFromLocalStorage()

  if (!checkDomainMatched(domains) && !isLocalMode) return

  const { pageType } = getPageInfo(window.location.pathname)
  /**
   * In the beginning of the page, if the host is Github and the page type is enabled,
   * (pathname is repo pages and not in the `disablePageTypeList`)
   * leave space for drawer by appending `margin-left style` to avoid `screen jumping`.
   */
  if (pageType && !disablePageTypeList.includes(pageType)) {
    appendGlobalStyle(drawerPinned, drawerWidth)
  }

  const onLoad = () => {
    const queryClient = new QueryClient()

    createContainer()

    ReactDOM.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <MainThemeProvider>
            <TokenPageGuides />
            <App />
            <SettingModal />
          </MainThemeProvider>
        </QueryClientProvider>
      </React.StrictMode>,
      document.getElementById(CONTAINER_ID)
    )
  }

  window.onload = onLoad
}

if (!isLocalMode) {
  listenContextMenu()
}
renderExtension()
