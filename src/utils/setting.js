import { initialState } from 'components/Setting/Context/reducer'

const LOCAL_STORAGE_SETTING_KEY = 'github-review-setting'

export const getSettingFromLocalStorage = (dispatch) => {
  let previousSetting

  try {
    previousSetting = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_SETTING_KEY)
    )
  } catch {
    previousSetting = {}
  }

  dispatch({
    type: 'SET_ALL_STATE',
    payload: { ...initialState, ...previousSetting },
  })
}

export const storeSettingIntoLocalStorage = (state) => {
  localStorage.setItem(LOCAL_STORAGE_SETTING_KEY, JSON.stringify(state))
}
