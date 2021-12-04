import { initialState } from 'stores/setting'
import { SETTING_KEY } from 'constants/base'

/**
 * @Note The data structure of zustand's persistent object will be
 * ```
 * LocalStorageKey: {
 *   state: { data1, data2, ...},
 *   version: 0,
 * }
 * ```
 */
export const getSettingFromLocalStorage = () => {
  try {
    return {
      ...initialState,
      ...JSON.parse(localStorage.getItem(SETTING_KEY)).state,
    }
  } catch {
    return initialState
  }
}

export const storeSettingIntoLocalStorage = (state) => {
  let originalData = null
  try {
    originalData = JSON.parse(localStorage.getItem(SETTING_KEY))
  } catch {
    originalData = { state: initialState }
  }

  const zustandPersistentObj = {
    ...originalData,
    state,
  }

  localStorage.setItem(SETTING_KEY, JSON.stringify(zustandPersistentObj))
}
