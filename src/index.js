import { CONTAINER_ID, isLocalMode } from 'constants/base'
import React from 'react'
import ReactDOM from 'react-dom'
import listenContextMenu from 'utils/contextMenuListener'
import { getPageInfo } from 'utils/github'
import { getSettingFromLocalStorage } from 'utils/setting'

import { create } from 'jss'
import { StylesProvider, jssPreset } from '@material-ui/core/styles'

function listenBodyRefresh(callback) {
  const observer = new MutationObserver((mutations) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const { addedNodes, removedNodes } of mutations) {
      const [addedBody, removedBody] = [addedNodes, removedNodes].map(findBodyElement)
      if (addedBody && removedBody) {
        callback()
      }
    }

    function findBodyElement(addedNodes) {
      return Array.from(addedNodes).find((addedNode) => addedNode instanceof HTMLBodyElement)
    }
  })
  observer.observe(document.documentElement, {
    childList: true
  })
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
  container.setAttribute('data-turbo-permanent', '')
  container.setAttribute('timestamp', new Date().getTime())
  document.body.appendChild(container)
  return container
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

    function initialATree() {
      const container = createContainer()

      ReactDOM.render(
        <React.StrictMode>
          <StylesProvider
            jss={create({
              ...jssPreset(),
              insertionPoint: document.getElementById(CONTAINER_ID)
            })}
          >
            <Main />
          </StylesProvider>
        </React.StrictMode>,
        container
      )
    }

    listenBodyRefresh(initialATree)
    initialATree()
  }

  window.onload = onLoad
}

if (!isLocalMode) {
  listenContextMenu()
}
renderExtension()
