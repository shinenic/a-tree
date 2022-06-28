import { CONTAINER_ID, isLocalMode } from 'constants/base'
import React from 'react'
import ReactDOM from 'react-dom'
import listenContextMenu from 'utils/contextMenuListener'
import { getPageInfo } from 'utils/github'
import { getSettingFromLocalStorage } from 'utils/setting'

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
  container.setAttribute('id', CONTAINER_ID)
  container.setAttribute('timestamp', new Date().getTime())
  document.body.appendChild(container)
}

const renderExtension = () => {
  const { drawerWidth, domains, disablePageTypeList, drawerPinned } = getSettingFromLocalStorage()

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
    /**
     * Load the main App whenever it's target domain
     * to prevent some conflict with the original web page.
     */
    // eslint-disable-next-line global-require
    const Main = require('./Main').default

    createContainer()

    ReactDOM.render(
      <React.StrictMode>
        <Main />
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
