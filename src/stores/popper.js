import create from 'zustand'

const toggleState = (key, set) => (isOn) =>
  set((prev) => ({
    [key]: typeof isOn === 'undefined' ? !prev[key] : isOn,
  }))

const states = (set) => ({
  isFileSearchOn: false,
  isSettingOn: false,
  isPullOn: false,
  isPullCommitOn: false,

  toggleFileSearch: toggleState('isFileSearchOn', set),
  toggleSetting: toggleState('isSettingOn', set),
  togglePull: toggleState('isPullOn', set),
  togglePullCommit: toggleState('isPullCommitOn', set),
})

const usePopperStore = create(states)

export default usePopperStore
