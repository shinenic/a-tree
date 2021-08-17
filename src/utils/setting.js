import { initialState } from 'components/Setting/Context/reducer'

const LOCAL_STORAGE_SETTING_KEY = 'github-review-setting'

export const getSettingFromLocalStorage = () => {
  try {
    return {
      ...initialState,
      ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTING_KEY)),
    }
  } catch {
    return initialState
  }
}

export const storeSettingIntoLocalStorage = (state) => {
  localStorage.setItem(LOCAL_STORAGE_SETTING_KEY, JSON.stringify(state))
}
