import { ACTION_TYPE } from 'components/FileSearchModal/reducer'

const { OPEN, CLOSE, SELECT_PREV, SELECT_NEXT, SELECT_INDEX } = ACTION_TYPE

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

const OPENED_SHORTCUT_ACTIONS = [
  { action: CLOSE, key: 'Escape' },
  { action: SELECT_PREV, key: 'ArrowUp' },
  { action: SELECT_NEXT, key: 'ArrowDown' },
  { action: SELECT_INDEX, key: 'Enter' },
  {
    action: CLOSE,
    key: ['k', 'p'],
    modifier: isMac ? 'metaKey' : 'ctrlKey',
    preventDefault: true,
  },
]

const CLOSED_SHORTCUT_ACTIONS = [
  {
    action: OPEN,
    key: ['k', 'p'],
    modifier: isMac ? 'metaKey' : 'ctrlKey',
    preventDefault: true,
  },
]

const isKeyMatched = (event, key, modifier) => {
  if (!key) return false

  if (modifier && !event[modifier]) return false

  if (Array.isArray(key)) {
    return key.includes(event.key)
  }

  return event.key === key
}

export const generateHotkeyListener = (dispatch, isModalOpened) => {
  const actions = isModalOpened
    ? OPENED_SHORTCUT_ACTIONS
    : CLOSED_SHORTCUT_ACTIONS

  const handler = (event) => {
    actions.some(({ action, key, modifier, preventDefault }) => {
      if (isKeyMatched(event, key, modifier)) {
        if (preventDefault) event.preventDefault()

        dispatch({ type: action })
        return true
      }

      return false
    })
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

export const buildUsedLetterMap = (keyword) => {
  return [...keyword].reduce(
    (map, letter) =>
      /[a-zA-Z]/.test(letter)
        ? { ...map, [letter.toLowerCase()]: true, [letter.toUpperCase()]: true }
        : map,
    {}
  )
}

export const highlightText = (text, highlightLetterMap) => {
  return [...text]
    .map((letter) => (highlightLetterMap[letter] ? `<b>${letter}</b>` : letter))
    .join('')
}
