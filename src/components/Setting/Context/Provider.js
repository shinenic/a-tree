import { useReducer, useContext, createContext, useEffect } from 'react'
import { reducer, initialState } from './reducer'
import {
  getSettingFromLocalStorage,
  storeSettingIntoLocalStorage,
} from 'utils/setting'

const SettingContext = createContext(initialState)
const SettingDispatchContext = createContext()

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    getSettingFromLocalStorage(dispatch)
  }, [])

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

export const useSettingCtx = () => {
  const state = useContext(SettingContext)
  if (!state) {
    throw new Error(
      'useSettingCtx must be used within a SettingContext.Provider'
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

export default Provider
