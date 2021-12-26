import { useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from 'react-query'
import { debounce } from 'lodash'

import { PULL_PAGE_TYPE } from 'constants/base'

const COMMIT_COUNTER_SELECTOR = '#commits_tab_counter'
const REFRESH_BTN_CONTAINER_SELECTOR = '#repo-content-pjax-container'
const REFRESH_BTN_SELECTOR = '.stale-files-tab-link'

/**
 * @note Strategy for refetch pull's data
 * 1. In `files changed tab`
 *      a. Listen the `Reload` button appears
 * 2. In other tabs
 *      a. Listen the count of commits in the nav tab (this may not work if force pushed)
 *      b. Listen the new comment about `push commit` (@TODO WIP)
 */
const useRefetchPull = ({ owner, repo, pull, pageType }) => {
  const queryClient = useQueryClient()

  const previousCommitCounter = useRef(undefined)

  const refetchCommitsAndTree = useCallback(() => {
    // ref: https://react-query.tanstack.com/reference/QueryClient#queryclientrefetchqueries
    queryClient.refetchQueries(['commits'], { stale: false })
    queryClient.refetchQueries({ active: true })
  }, [queryClient])

  /**
   * @strategy 1-a
   */
  useEffect(() => {
    if (!pull || pageType !== PULL_PAGE_TYPE.PULL_FILES) return

    const container = document.querySelector(REFRESH_BTN_CONTAINER_SELECTOR)
    if (!container) return

    const debouncedCallback = debounce(() => {
      if (!container.querySelector(REFRESH_BTN_SELECTOR)) return
      refetchCommitsAndTree()
    }, 100)

    const observer = new MutationObserver(debouncedCallback)
    observer.observe(container, { attributes: false, childList: true, subtree: true })

    return () => observer.disconnect()
  }, [pageType, pull, refetchCommitsAndTree])

  /**
   * @strategy 2-a
   */
  useEffect(() => {
    if (!pull) return

    const target = document.querySelector(COMMIT_COUNTER_SELECTOR)
    if (!target) return

    const callback = () => {
      const newValue = target?.innerText
      if (
        previousCommitCounter.current !== undefined &&
        newValue !== previousCommitCounter.current
      ) {
        refetchCommitsAndTree()
      }

      previousCommitCounter.current = newValue
    }

    const observer = new MutationObserver(callback)
    callback()

    observer.observe(target, { attributes: false, childList: true, subtree: false })

    return () => observer.disconnect()
  }, [owner, pull, repo, pageType, refetchCommitsAndTree])
}

export default useRefetchPull
