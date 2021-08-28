import { GLOBAL_MESSAGE_TYPE } from 'constants'

const activeTabUrlMemo = {}

/**
 * To support Github SPA
 * ref: https://developer.chrome.com/docs/extensions/reference/webNavigation/
 */
chrome.webNavigation.onHistoryStateUpdated.addListener(({ tabId, url }) => {
  if (activeTabUrlMemo[tabId] !== url) {
    activeTabUrlMemo[tabId] = url

    chrome.tabs.sendMessage(tabId, {
      type: GLOBAL_MESSAGE_TYPE.ON_HISTORY_UPDATED,
    })
  }
})

chrome.tabs.onRemoved.addListener((tabId) => {
  if (activeTabUrlMemo[tabId]) {
    delete activeTabUrlMemo[tabId]
  }
})
