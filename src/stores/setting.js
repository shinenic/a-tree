import { DRAWER_POSITION, SETTING_KEY } from 'constants'

import create from 'zustand'
import { persist } from 'zustand/middleware'

const { LEFT, RIGHT } = DRAWER_POSITION

/**
 * @typedef SettingState
 * @type {object}
 * @property {string} token personal access token
 * @property {'left'|'right'} position position of main drawer
 * @property {boolean} isFocusMode repository name
 * @property {number} drawerWidth
 * @property {string[]} domains custom Enterprise domains
 * @property {string[]} disablePageTypeList stop drawer on specified page types
 * @property {boolean} isModalOpening
 * @property {boolean} drawerPinned
 * @property {number} floatingButtonPositionY position Y of floating button (px)
 * @property {string} baseUrl record host string for api endpoint
 * @property {boolean} isTokenHintShowed
 */

/** @type {SettingState} */
export const initialState = {
  token: '',
  position: LEFT,
  isFocusMode: false,
  drawerWidth: 300,
  domains: [],
  disablePageTypeList: [],
  isModalOpening: false,
  drawerPinned: true,
  floatingButtonPositionY: 500,
  baseUrl: null,
  isTokenHintShowed: false,
}

/**
 * @param {SettingState} state
 * @param {object} action
 */
export const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'UPDATE_TOKEN':
      return { ...state, token: payload }
    case 'SET_DRAWER_POSITION_LEFT':
      return { ...state, position: LEFT }
    case 'SET_DRAWER_POSITION_RIGHT':
      return { ...state, position: RIGHT }
    case 'TOGGLE_FOCUS_MODE':
      return { ...state, isFocusMode: !state.isFocusMode }
    case 'UPDATE_DRAWER_WIDTH':
      return { ...state, drawerWidth: payload }
    case 'UPDATE_BASE_URL':
      return { ...state, baseUrl: payload }
    case 'UPDATE_DISABLE_PAGE_TYPE_LIST':
      return { ...state, disablePageTypeList: payload }
    case 'OPEN_MODAL':
      return { ...state, isModalOpening: true }
    case 'CLOSE_MODAL':
      return { ...state, isModalOpening: false }
    case 'UPDATE_FLOATING_BUTTON_POSITION_Y':
      return { ...state, floatingButtonPositionY: payload }
    case 'TOGGLE_DRAWER':
      return { ...state, drawerPinned: !state.drawerPinned }
    case 'SET_TOKEN_HINT_SHOWED':
      return { ...state, isTokenHintShowed: true }
    default:
      throw new Error(`Unknown Type: ${type}`)
  }
}

const states = (set) => ({
  ...initialState,
  dispatch: ({ type, payload } = {}) =>
    set((state) => reducer(state, { type, payload })),
})

const useStore = create(persist(states, { name: SETTING_KEY }))

export default useStore
