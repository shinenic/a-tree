import { matchSorter } from 'match-sorter'
import { noop, isEmpty } from 'lodash'

/**
 * @typedef FileSearchModalState
 * @type {object}
 * @property {boolean} isOpened is modal opened
 * @property {object[]} files source of all files
 * @property {object[]} result result after filtered
 * @property {number} selectedIndex current selected index of result
 * @property {function} selectCallback
 * @property {number} maxResultCount
 * @property {string} keyword
 */

/** @type {FileSearchModalState} */
export const initialState = {
  isOpened: false,
  files: [],
  maxResultCount: 20,
  result: [],
  keyword: '',
  selectedIndex: 0,
  selectCallback: noop,
}

export const ACTION_TYPE = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  CLEAR_SOURCE_DATA: 'CLEAR_SOURCE_DATA',
  UPDATE_SOURCE_DATA: 'UPDATE_SOURCE_DATA',
  UPDATE_KEYWORD: 'UPDATE_KEYWORD',
  UPDATE_SELECT_CALLBACK: 'UPDATE_SELECT_CALLBACK',
  SELECT_PREV: 'SELECT_PREV',
  SELECT_NEXT: 'SELECT_NEXT',
  SELECT_INDEX: 'SELECT_INDEX',
}

const {
  OPEN,
  CLOSE,
  CLEAR_SOURCE_DATA,
  UPDATE_SOURCE_DATA,
  SELECT_PREV,
  SELECT_NEXT,
  UPDATE_SELECT_CALLBACK,
  UPDATE_KEYWORD,
  SELECT_INDEX,
} = ACTION_TYPE

/**
 * @param {FileSearchModalState} state
 * @param {object} action
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case OPEN:
      return {
        ...state,
        isOpened: true,
        result: state.files.slice(0, state.maxResultCount),
        keyword: '',
        selectedIndex: 0,
      }
    case CLOSE:
      return {
        ...state,
        isOpened: false,
      }
    case UPDATE_SELECT_CALLBACK: {
      const { selectCallback } = action.payload
      return { ...state, selectCallback }
    }
    case UPDATE_SOURCE_DATA: {
      const { files } = action.payload
      return {
        ...state,
        files,
        result: files.slice(0, state.maxResultCount),
        keyword: '',
        selectedIndex: 0,
      }
    }
    case CLEAR_SOURCE_DATA: {
      return {
        ...state,
        files: [],
        result: [],
        keyword: '',
        selectedIndex: 0,
      }
    }
    case UPDATE_KEYWORD: {
      const { keyword = '' } = action.payload
      const { maxResultCount, files } = state
      return {
        ...state,
        keyword,
        selectedIndex: 0,
        result: keyword
          ? matchSorter(files, keyword.trim(), {
              keys: ['path', 'filename'],
            }).slice(0, maxResultCount)
          : files.slice(0, maxResultCount),
      }
    }
    case SELECT_PREV: {
      const { selectedIndex } = state
      return {
        ...state,
        selectedIndex: selectedIndex === 0 ? 0 : selectedIndex - 1,
      }
    }
    case SELECT_NEXT: {
      const { selectedIndex, result } = state
      return {
        ...state,
        selectedIndex:
          selectedIndex + 1 >= result.length
            ? selectedIndex
            : selectedIndex + 1,
      }
    }
    case SELECT_INDEX: {
      const { result, selectedIndex, selectCallback } = state

      if (!isEmpty(result) && selectedIndex >= 0) {
        selectCallback(result[action.payload?.selectedIndex ?? selectedIndex])
      }

      return {
        ...state,
        isOpened: false,
      }
    }
    default:
      throw new Error(`Unknown Type: ${action.type}`)
  }
}
