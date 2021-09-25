import { useCallback, useRef } from 'react'
import sha256 from 'crypto-js/sha256'

import { focusFile, scrollToFile, resetFocusFiles } from 'utils/pullPage'
import { useSettingStateCtx } from 'components/Setting/Context/Provider'
import useUpdateEffect from 'hooks/useUpdateEffect'
import { PAGE_TYPE } from 'constants'
import { scrollToTabsNav } from 'utils/scroll'
import { linkGithubPage } from 'utils/link'

const isEnterprise = window.location.host !== 'github.com'

const getFileHash = (filename) => `diff-${sha256(filename)}`

const getFileLink = (baseUrl, filename) => `${baseUrl}#${getFileHash(filename)}`

const useLinkPullFile = ({ basePathname, pageType }) => {
  const { isFocusMode } = useSettingStateCtx()
  const previousLockedFile = useRef(null)

  /**
   * When `isFocusMode` off,
   * restore all files' visibility and scroll to the last file that user clicked.
   */
  useUpdateEffect(() => {
    if (!isFocusMode && previousLockedFile.current) {
      resetFocusFiles()
      scrollToFile(getFileHash(previousLockedFile.current))
      previousLockedFile.current = null
    }
  }, [isFocusMode])

  const onItemClick = useCallback(
    ({ filename }, e) => {
      if (!filename) return

      /**
       * For page which is need to do SPA,
       * navigate to the specified file node via link instead of `scrollTo`
       * (navigate via hash will cause screen tremble)
       */
      if (
        pageType !== PAGE_TYPE.PULL_FILES &&
        pageType !== PAGE_TYPE.CODE_COMMIT &&
        pageType !== PAGE_TYPE.PULL_COMMIT &&
        pageType !== PAGE_TYPE.PULL_COMMITS
      ) {
        linkGithubPage(
          getFileLink(basePathname, filename),
          isEnterprise ? '#js-repo-pjax-container' : undefined
        )
        return
      }

      scrollToFile(getFileHash(filename))

      if (!isFocusMode) {
        scrollToFile(getFileHash(filename))
        return
      }

      try {
        if (previousLockedFile.current !== filename) {
          focusFile(getFileHash(filename))
          scrollToTabsNav()
          previousLockedFile.current = filename
        } else {
          resetFocusFiles()
          scrollToFile(getFileHash(filename))
          previousLockedFile.current = null
        }
      } catch (error) {
        console.error(error)
      }

      if (e) {
        e.stopPropagation()
      }
    },
    [isFocusMode, pageType, basePathname]
  )

  return onItemClick
}

export default useLinkPullFile
