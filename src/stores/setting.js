import { DRAWER_POSITION } from 'constants'
import {
  getSettingFromLocalStorage,
  storeSettingIntoLocalStorage,
} from 'utils/setting'
import { mapValues, pick, keys } from 'lodash'
import create from 'zustand'

const { LEFT, RIGHT } = DRAWER_POSITION

/**
 * @typedef SettingState
 * @type {object}
 * @property {string} token personal access token
 * @property {'left'|'right'} position position of main drawer
 * @property {boolean} isFocusMode repository name
 * @property {number} drawerWidth
 */

/** @type {SettingState} */
export const initialState = {
  token: '',
  position: LEFT,
  isFocusMode: false,
  drawerWidth: 300,
}

const createInitialState = () => {
  const previousState = getSettingFromLocalStorage()

  return { ...initialState, ...pick(previousState, keys(initialState)) }
}

const createDispatches = (set, get) => {
  const customSetter = (arg) => {
    storeSettingIntoLocalStorage({ ...get() })
  }
  return {
    updateToken: (token = '') => set({ token }),
    toggleFocusMode: () => set(({ isFocusMode }) => !isFocusMode),
    updateDrawerWidth: (drawerWidth = 300) => set({ drawerWidth }),
    updateBaseUrl: (baseUrl) => set({ baseUrl }),
    setDrawerPositionLeft: () => set({ position: LEFT }),
    setDrawerPositionRight: () => set({ position: RIGHT }),
  }
}

const useStore = create((set) => ({
  ...createInitialState(),
  ...createDispatches(set),
}))

export default useStore

/**
 * @param {SettingState} state
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
