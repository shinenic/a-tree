import { ACTION_TYPE } from 'components/FileSearchModal/reducer'
import { IS_MAC } from 'constants/base'

const { OPEN, CLOSE, SELECT_PREV, SELECT_NEXT, SELECT_INDEX } = ACTION_TYPE

const getOpenedHotkeyActions = (customToggleKey = 'i') => [
  { action: CLOSE, key: 'Escape' },
  { action: SELECT_PREV, key: 'ArrowUp' },
  { action: SELECT_NEXT, key: 'ArrowDown' },
  { action: SELECT_INDEX, key: 'Enter', preventDefault: true },
  {
    action: CLOSE,
    key: customToggleKey,
    modifier: IS_MAC ? 'metaKey' : 'ctrlKey',
    preventDefault: true,
    stopPropagation: true
  }
]

const getClosedHotkeyActions = (customToggleKey = 'i') => [
  {
    action: OPEN,
    key: customToggleKey,
    modifier: IS_MAC ? 'metaKey' : 'ctrlKey',
    preventDefault: true,
    stopPropagation: true
  }
]

const isKeyMatched = (event, key, modifier) => {
  if (!key) return false

  if (modifier && !event[modifier]) return false

  if (Array.isArray(key)) {
    return key.includes(event.key)
  }

  return event.key === key
}

export const generateHotkeyListener = (dispatch, isModalOpened, customToggleKey) => {
  const actions = isModalOpened
    ? getOpenedHotkeyActions(customToggleKey)
    : getClosedHotkeyActions(customToggleKey)

  const handler = (event) => {
    actions.some(({ action, key, modifier, preventDefault, stopPropagation }) => {
      if (isKeyMatched(event, key, modifier)) {
        if (preventDefault) event.preventDefault()
        if (stopPropagation) event.stopPropagation()

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
      /[a-zA-Z0-9]/.test(letter)
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
