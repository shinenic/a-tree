import { useCallback, useRef } from 'react'
import useStore from 'stores/setting'

import {
  focusFile,
  scrollToFile,
  resetFocusFiles,
  checkPjaxEnd,
  getFileHashId,
  checkFileNodeExisting,
} from 'utils/pullPage'
import useUpdateEffect from 'hooks/useUpdateEffect'

import { PAGE_TYPE, isGithubHost } from 'constants'
import { scrollToTabsNav } from 'utils/scroll'
import { linkGithubPage } from 'utils/link'

const linkToFileHash = (basePathname, filename) => {
  linkGithubPage(
    `${basePathname}#${getFileHashId(filename)}`,
    isGithubHost ? undefined : '#js-repo-pjax-container'
  )
}

const useLinkPullFile = ({ basePathname, pageType }) => {
  const isFocusMode = useStore((s) => s.isFocusMode)
  const previousLockedFile = useRef(null)

  /**
   * Use this method after pjax start
   */
  const asyncCheckFileNode = useCallback(
    async (filename) =>
      checkPjaxEnd().then(() => checkFileNodeExisting(getFileHashId(filename))),
    []
  )

  const handleFocusFileNode = useCallback((filename) => {
    focusFile(getFileHashId(filename))
    scrollToTabsNav()
    previousLockedFile.current = filename
  }, [])

  const handleUnFocus = useCallback((filename) => {
    resetFocusFiles()
    scrollToFile(getFileHashId(filename))
    previousLockedFile.current = null
  }, [])

  /**
   * When `isFocusMode` off,
   * restore all files' visibility and scroll to the last file that user clicked.
   */
  useUpdateEffect(() => {
    if (!isFocusMode && previousLockedFile.current) {
      handleUnFocus(previousLockedFile.current)
    }
  }, [isFocusMode])

  const onItemClick = useCallback(
    async ({ filename }, e) => {
      if (!filename) return

      /**
       * For pages which are need to do SPA (Not in `Files Changed` page)
       */
      if (
        pageType !== PAGE_TYPE.PULL_FILES &&
        pageType !== PAGE_TYPE.CODE_COMMIT &&
        pageType !== PAGE_TYPE.PULL_COMMIT &&
        pageType !== PAGE_TYPE.PULL_COMMITS
      ) {
        linkToFileHash(basePathname, filename)

        if (isFocusMode) {
          /**
           * Observe the pjax end and dom created to handle lazy load until timeout
           */
          asyncCheckFileNode(filename).then(() => {
            handleFocusFileNode(filename)
          })
        }

        return
      }

      scrollToFile(getFileHashId(filename))

      if (!isFocusMode) return

      try {
        if (previousLockedFile.current !== filename) {
          checkFileNodeExisting(getFileHashId(filename), 0)
            .then(() => {
              handleFocusFileNode(filename)
            })
            /**
             * If the file node dom not found,
             * link to the file hash and wait for the lazy load done until timeout
             */
            .catch(() => {
              linkToFileHash(basePathname, filename)

              asyncCheckFileNode().then(() => {
                handleFocusFileNode(filename)
              })
            })
        } else {
          handleUnFocus(filename)
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
