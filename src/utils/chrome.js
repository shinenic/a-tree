import { isLocalMode } from 'constants'
import { GLOBAL_MESSAGE_TYPE } from 'constants/background'

export const getURL = (url) => {
  return isLocalMode ? url : window.chrome.runtime.getURL(url)
}

export const openInNewTab = (pathname) => {
  window.chrome.runtime.sendMessage({
    type: GLOBAL_MESSAGE_TYPE.OPEN_LINK_IN_NEW_TAB,
    payload: `${window.location.origin}${pathname}`,
  })
}
