import { useReducer, useContext, createContext, useEffect } from 'react'
import {
  getSettingFromLocalStorage,
  storeSettingIntoLocalStorage,
} from 'utils/setting'
import { reducer, initialState } from './reducer'

const SettingContext = createContext(initialState)
const SettingDispatchContext = createContext()

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getSettingFromLocalStorage())

  useEffect(() => {
    storeSettingIntoLocalStorage(state)
  }, [state])

  return (
    <SettingContext.Provider value={state}>
      <SettingDispatchContext.Provider value={dispatch}>
        {children}
      </SettingDispatchContext.Provider>
    </SettingContext.Provider>
  )
}

export const useSettingStateCtx = () => {
  const state = useContext(SettingContext)
  if (!state) {
    throw new Error(
      'useSettingStateCtx must be used within a SettingContext.Provider'
    )
  }

  return state
}

export const useSettingDispatchCtx = () => {
  const dispatch = useContext(SettingDispatchContext)
  if (!dispatch) {
    throw new Error(
      'useSettingDispatchCtx must be used within a SettingDispatchContext.Provider'
    )
  }

  return dispatch
}

export const useSettingCtx = () => {
  const state = useSettingStateCtx()
  const dispatch = useSettingDispatchCtx()

  return [state, dispatch]
}

export default Provider
