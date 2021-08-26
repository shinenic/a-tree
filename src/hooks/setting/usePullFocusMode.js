import { useCallback, useRef } from 'react'
import { focusFile, scrollToFile, resetFocusFiles } from 'utils/pullPage'
import { useSettingStateCtx } from 'components/Setting/Context/Provider'
import useUpdateEffect from 'hooks/useUpdateEffect'

const usePullFocusMode = () => {
  const { isFocusMode } = useSettingStateCtx()
  const previousLockedFile = useRef(null)

  /**
   * When `isFocusMode` off,
   * restore all files' visibility and scroll to the last file that user clicked.
   */
  useUpdateEffect(() => {
    if (!isFocusMode && previousLockedFile.current) {
      resetFocusFiles(previousLockedFile.current)
    }
  }, [isFocusMode])

  const onItemClick = useCallback(
    ({ filename }, e) => {
      if (!filename) return

      if (!isFocusMode) {
        scrollToFile(filename)
      } else if (previousLockedFile.current === filename) {
        resetFocusFiles(filename)
        previousLockedFile.current = null
      } else {
        focusFile(filename)
        previousLockedFile.current = filename
      }

      if (e) {
        e.stopPropagation()
      }
    },
    [isFocusMode]
  )

  return onItemClick
}

export default usePullFocusMode
