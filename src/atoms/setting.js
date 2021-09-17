import { DRAWER_POSITION, LOCAL_STORAGE_KEY_PREFIX } from 'constants'
import { atom } from 'jotai'
import { focusAtom } from 'jotai/optics'

const { LEFT, RIGHT } = DRAWER_POSITION

/**
 * @typedef SettingData
 * @type {object}
 * @property {string} token personal access token
 * @property {'left'|'right'} position position of main drawer
 * @property {boolean} isFocusMode repository name
 * @property {number} drawerWidth
 */

/** @type {SettingData} */
const initialData = {
  token: '',
  position: LEFT,
  isFocusMode: false,
  drawerWidth: 300,
}

const storeSettingIntoLocalStorage = (state) => {
  localStorage.setItem(
    `${LOCAL_STORAGE_KEY_PREFIX}setting`,
    JSON.stringify(state)
  )
}

/** @return {SettingData} */
const getSettingFromLocalStorage = () => {
  try {
    return {
      ...initialData,
      ...JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}setting`)),
    }
  } catch {
    return initialData
  }
}

export const settingAtom = atom(getSettingFromLocalStorage())
export const tokenAtom = focusAtom(settingAtom, (obj) => obj.prop('token'))
export const positionAtom = focusAtom(settingAtom, (obj) =>
  obj.prop('position')
)
export const isFocusModeAtom = focusAtom(settingAtom, (obj) =>
  obj.prop('isFocusMode')
)
export const drawerWidthAtom = focusAtom(settingAtom, (obj) =>
  obj.prop('drawerWidth'),
  ()
)

/**
 * @param {SettingData} state
 * @param {object} action
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TOKEN':
      return { ...state, token: action.payload }
    case 'SET_DRAWER_POSITION_LEFT':
      return { ...state, position: LEFT }
    case 'SET_DRAWER_POSITION_RIGHT':
      return { ...state, position: RIGHT }
    case 'TOGGLE_FOCUS_MODE':
      return { ...state, isFocusMode: !state.isFocusMode }
    case 'UPDATE_DRAWER_WIDTH':
      return { ...state, drawerWidth: action.payload }
    case 'UPDATE_BASE_URL':
      return { ...state, baseUrl: action.payload }
    default:
      throw new Error(`Unknown Type: ${action.type}`)
  }
}
