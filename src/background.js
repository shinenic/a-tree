import { GLOBAL_MESSAGE_TYPE, CONTEXT_MENU_ITEM_ID } from 'constants/background'

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

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ITEM_ID.ENABLE_EXTENSION,
    title: 'Enable a-tree in this domain',
    contexts: ['all'],
  })

  chrome.contextMenus.create({
    id: CONTEXT_MENU_ITEM_ID.DISABLE_EXTENSION,
    title: 'Disable a-tree in this domain',
    contexts: ['all'],
  })
})

chrome.contextMenus.onClicked.addListener(({ menuItemId }, tabs) => {
  chrome.tabs.sendMessage(tabs.id, {
    type: GLOBAL_MESSAGE_TYPE.ON_CONTEXT_MENU_CLICKED,
    payload: {
      menuItemId,
    },
  })
})

/**
 * To enable `Open link in new tab` but `STAY` on current page
 */
chrome.runtime.onMessage.addListener(({ type, payload }, sender) => {
  switch (type) {
    case GLOBAL_MESSAGE_TYPE.OPEN_LINK_IN_NEW_TAB: {
      chrome.tabs.create({
        url: payload,
        active: false,
        index: sender.tab.index + 1,
      })
      break
    }
    default:
      break
  }
})
