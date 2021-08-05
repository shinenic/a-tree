import { useState, useEffect } from 'react'
import { getPageInfo } from 'utils/github'
import { useQueryRepoInfo } from 'hooks/api/useGithubQueries'

import useListenLocation from 'hooks/pageInfo/useListenLocation'
import useListenTitle from 'hooks/pageInfo/useListenTitle'

/**
 * This hook return pageInfo if the page is supported,
 * to get the necessary data, we need 3 thing to ensure the full page info.
 * 1. default branch - this value will come from `repo info api` response,
 *    (repo info api)  the api can also be used to check whether the page(pathname) is under a `accessible` repository,
 *                     then the `pageInfo` will return `empty` if `repo id` of response not found
 * 2. pathname - from url listener
 * 3. title    - from dom listener
 * @typedef {Object} PageInfoHook
 * @property {PageInfo} pageInfo
 * @property {boolean} isLoading
 * @property {boolean} error
 *
 * @returns {PageInfoHook}
 */
const usePageInfo = () => {
  const { pathname } = useListenLocation()
  const title = useListenTitle()
  const [_, firstPath, secondPath] = pathname.split('/')
  const { data, isLoading, error } = useQueryRepoInfo(
    {
      owner: firstPath,
      repo: secondPath,
    },
    {
      onSuccess: (data) => {
        setPageInfo(getPageInfo(pathname, data?.default_branch, title))
      },
    }
  )
  const [pageInfo, setPageInfo] = useState(() => getPageInfo(pathname))

  // This effect handle SPA by listening `pathname`, `data` is used to get default branch only
  useEffect(() => {
    if (data) {
      setPageInfo(getPageInfo(pathname, data?.default_branch, title))
    }
  }, [pathname])

  if (isLoading) return { error: null, isLoading: true, pageInfo: {} }

  if (!data?.id || error) {
    return { error, isLoading: false, pageInfo: {} }
  }

  return { error: null, isLoading: false, pageInfo }
}

export default usePageInfo
