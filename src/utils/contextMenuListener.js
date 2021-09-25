import { CONTEXT_MENU_ITEM_ID } from 'constants'
import { reject } from 'lodash'

import { GLOBAL_MESSAGE_TYPE } from '../constants/index'
import {
  getSettingFromLocalStorage,
  storeSettingIntoLocalStorage,
} from './setting'

const listenContextMenu = () => {
  const handler = ({ type, payload }) => {
    if (type === GLOBAL_MESSAGE_TYPE.ON_CONTEXT_MENU_CLICKED) {
      const { menuItemId } = payload
      const prevState = getSettingFromLocalStorage()
      const { host } = window.location

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
  }

  window.chrome.runtime.onMessage.addListener(handler)

  return () => {
    window.chrome.runtime.onMessage.removeListener(handler)
  }
}

export default listenContextMenu
