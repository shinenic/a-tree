import { isLocalMode } from 'constants'

export const getURL = (url) => {
  return isLocalMode ? url : window.chrome.runtime.getURL(url)
}
