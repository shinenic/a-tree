import { createMachine, assign } from 'xstate'
import { linkGithubPage } from 'utils/link'
import { matchSorter } from 'match-sorter'

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

const actionHotKeyMap = {
  OPEN: {
    key: 'k',
    modifier: isMac ? 'metaKey' : 'ctrlKey',
    preventDefault: true,
  },
  CLOSE: { key: 'Escape' },
  SELECT_PREV: { key: 'ArrowUp' },
  SELECT_NEXT: { key: 'ArrowDown' },
  SELECT_INDEX: { key: 'Enter' },
}

export const generateHotkeyListener = (dispatch) => {
  const handler = (event) => {
    Object.entries(actionHotKeyMap).some(
      ([action, { key, modifier, preventDefault }]) => {
        if (event.key === key && (!modifier || event[modifier])) {
          if (preventDefault) event.preventDefault()

          dispatch(action)
          return true
        }

        return false
      }
    )
  }

  /**
   * The <input> will stop event bubbling manually in order to avoid some built-in shortcuts,
   * so we have to catch events by enable `useCapture` when <input> focused.
   */
  window.addEventListener('keydown', handler, true)

  return () => {
    window.removeEventListener('keydown', handler, true)
  }
}

export const createFileSearchMachine = ({
  files = [],
  getFilePathLink,
  maxResultCount = 20,
}) =>
  createMachine(
    {
      id: 'root',
      initial: 'closed',
      context: {
        getFilePathLink,
        files,
        maxResultCount,
        result: files.slice(0, maxResultCount),
        keyword: '',
        selectedIndex: 0,
      },
      invoke: { src: 'keyListener' },
      on: {
        ON_FILES_UPDATE: {
          actions: ['setNewFiles', 'resetModal'],
        },
      },
      states: {
        closed: {
          on: {
            OPEN: {
              target: 'opened',
              actions: 'resetModal',
            },
          },
        },
        opened: {
          on: {
            CLOSE: 'closed',
            UPDATE_KEYWORD: {
              actions: ['setKeyword', 'setResult', 'resetIndex'],
            },
            SELECT_PREV: {
              cond: 'isNotFirst',
              actions: 'selectPrev',
            },
            SELECT_NEXT: {
              cond: 'isNotLast',
              actions: 'selectNext',
            },
            SELECT_INDEX: {
              actions: 'gotoFile',
              target: 'closed',
            },
          },
        },
      },
    },
    {
      actions: {
        setNewFiles: assign((_, { files, getFilePathLink }) => ({
          files,
          getFilePathLink,
        })),
        setKeyword: assign((_, { input }) => ({ keyword: input })),
        setResult: assign(({ files, keyword, maxResultCount }) => ({
          result: keyword
            ? matchSorter(files, keyword.trim(), { keys: ['path'] }).slice(
                0,
                maxResultCount
              )
            : files.slice(0, maxResultCount),
        })),
        selectNext: assign((ctx) => ({ selectedIndex: ctx.selectedIndex + 1 })),
        selectPrev: assign((ctx) => ({ selectedIndex: ctx.selectedIndex - 1 })),
        resetIndex: assign({ selectedIndex: 0 }),
        gotoFile: ({ selectedIndex, result, getFilePathLink }, { index }) => {
          const fileLink = getFilePathLink(result[index ?? selectedIndex].path)
          linkGithubPage(fileLink)
        },
        resetModal: assign(({ files, maxResultCount }) => ({
          result: files.slice(0, maxResultCount),
          keyword: '',
          selectedIndex: 0,
        })),
      },
      guards: {
        isNotFirst: ({ selectedIndex }) => selectedIndex !== 0,
        isNotLast: ({ maxResultCount, selectedIndex }) =>
          selectedIndex !== maxResultCount - 1,
      },
      services: {
        keyListener: () => (callback) => {
          const unlisten = generateHotkeyListener(callback)

          return () => unlisten()
        },
      },
    }
  )
