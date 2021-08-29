import { matchSorter } from 'match-sorter'
import { getFileLink, linkGithubPage } from 'utils/link'

/**
 * @typedef FileSearchModalState
 * @type {object}
 * @property {boolean} isOpened is modal opened
 * @property {boolean} isLoading is modal opened
 * @property {object[]} files source of all files
 * @property {object[]} result result after filtered
 * @property {number} selectedIndex current selected index of result
 * @property {number} maxResultCount
 * @property {string} keyword
 * @property {PageInfo} pageInfo
 */

/** @type {FileSearchModalState} */
export const initialState = {
  isOpened: false,
  isLoading: true,
  files: [],
  maxResultCount: 20,
  result: [],
  keyword: '',
  selectedIndex: 0,
  pageInfo: {},
}

export const ACTION_TYPE = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  SET_IS_LOADING: 'SET_IS_LOADING',
  UPDATE_SOURCE_DATA: 'UPDATE_SOURCE_DATA',
  UPDATE_KEYWORD: 'UPDATE_KEYWORD',
  SELECT_PREV: 'SELECT_PREV',
  SELECT_NEXT: 'SELECT_NEXT',
  SELECT_INDEX: 'SELECT_INDEX',
}

const {
  OPEN,
  CLOSE,
  SET_IS_LOADING,
  UPDATE_SOURCE_DATA,
  SELECT_PREV,
  SELECT_NEXT,
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
    case SET_IS_LOADING:
      const { isLoading } = action.payload
      return { ...state, isLoading }
    case UPDATE_SOURCE_DATA:
      const { files } = action.payload
      return {
        ...state,
        files,
        isLoading: false,
        result: files.slice(0, state.maxResultCount),
        keyword: '',
        selectedIndex: 0,
      }
    case UPDATE_KEYWORD: {
      const { keyword = '' } = action.payload
      const { maxResultCount, files } = state
      return {
        ...state,
        keyword,
        selectedIndex: 0,
        result: keyword
          ? matchSorter(files, keyword.trim(), { keys: ['path'] }).slice(
              0,
              maxResultCount
            )
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
      const { result, pageInfo, selectedIndex } = state
      const filePath =
        result[action.payload?.selectedIndex ?? selectedIndex].path
      const fileLink = getFileLink({
        ...pageInfo,
        type: 'blob',
        filePath,
      })
      linkGithubPage(fileLink)

      return {
        ...state,
        isOpened: false,
      }
    }
    default:
      throw new Error(`Unknown Type: ${action.type}`)
  }
}
