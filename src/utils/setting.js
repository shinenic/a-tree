import { initialState } from 'components/Setting/Context/reducer'
import { LOCAL_STORAGE_KEY_PREFIX } from 'constants'

export const getSettingFromLocalStorage = () => {
  try {
    return {
      ...initialState,
      ...JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}setting`)),
    }
  } catch {
    return initialState
  }
}

export const storeSettingIntoLocalStorage = (state) => {
  localStorage.setItem(
    `${LOCAL_STORAGE_KEY_PREFIX}setting`,
    JSON.stringify(state)
  )
}
