import { useEffect, useCallback, useRef } from 'react'
import { focusFile, scrollToFile, resetFocusFiles } from 'utils/pullPage'
import { useSettingCtx } from 'components/Setting/Context/Provider'

const usePullFocusMode = () => {
  const { isFocusMode } = useSettingCtx()
  const previousClickedFile = useRef()

  /**
   * When `isFocusMode` off,
   * restore all files' visibility and scroll to the last file that user clicked.
   */
  useEffect(() => {
    if (!isFocusMode) {
      resetFocusFiles(previousClickedFile.current)
    }
  }, [isFocusMode])

  const onItemClick = useCallback(
    (node, e) => {
      if (!node?.blob_url) return

      const filePath = node.blob_url.split('/').slice(7).join('/')
      previousClickedFile.current = filePath
      if (isFocusMode) {
        focusFile(filePath)
      } else {
        scrollToFile(filePath)
      }
      e.stopPropagation()
    },
    [isFocusMode]
  )

  return onItemClick
}

export default usePullFocusMode
