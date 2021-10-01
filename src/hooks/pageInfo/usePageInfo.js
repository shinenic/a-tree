import { useState, useEffect } from 'react'
import { getPageInfo, isGithubReservedUsername } from 'utils/github'
import useStore from 'stores/setting'
import { createGithubQuery } from 'utils/api'
import { ERROR_MESSAGE } from 'constants'

import useListenLocation from 'hooks/pageInfo/useListenLocation'
import useListenTitle from 'hooks/pageInfo/useListenTitle'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

const API_RATE_LIMIT = 403
const NOT_FOUND_STATUS = 404
const INVALID_TOKEN_STATUS = 401
const OK_STATUS = 200

const isGithubPage = (host) => host === 'github.com'

/**
 * This hook return pageInfo if the page is supported,
 * to get the necessary data, we need 3 thing to ensure the full page info.
 * 1. default branch - this value will come from `repo info api` response,
 *    (repo info api)  the api can also be used to check whether the page(pathname)
 *    is under a `accessible` repository,
 * 2. pathname - from url listener
 * 3. title    - from dom listener
 *
 * For the error message, check if the word of owner is reserved ('setting', 'pulls', etc.) first,
 *   if not => check the response of api whether `OK`,
 *   if not => check if the API rate limit exceeded.
 *   if not => check if the token is invalid (wrong, expired, etc.).
 *   if not => check if the name of repo isn't available.
 *   if not => the token may miss permissions to access this repository.
 * @typedef {Object} PageInfoHook
 * @property {PageInfo} pageInfo
 * @property {boolean} isLoading
 * @property {Error} error the message will be the one of `ERROR_MESSAGE`
 *
 * @returns {PageInfoHook}
 */
const usePageInfo = () => {
  const token = useStore((s) => s.token)
  const dispatch = useStore((s) => s.dispatch)

  const { pathname, host } = useListenLocation()
  const [, firstPath, secondPath] = pathname.split('/')
  const title = useListenTitle()
  const [pageInfo, setPageInfo] = useState({})

  const {
    data: defaultBranch,
    isLoading,
    error,
  } = useQuery(
    ['pageInfo', { owner: firstPath, repo: secondPath, token }],
    async () => {
      if (!secondPath || !firstPath || isGithubReservedUsername(firstPath)) {
        throw new Error(ERROR_MESSAGE.NOT_SUPPORTED_PAGE)
      }

      try {
        const baseUrl = isGithubPage(host)
          ? null
          : `${window.location.origin}/api/v3`

        const repoResponse = await createGithubQuery({
          url: '/repos/{owner}/{repo}',
          placeholders: { owner: firstPath, repo: secondPath },
          token,
          baseUrl,
        })

        dispatch({ type: 'UPDATE_BASE_URL', payload: baseUrl })

        return repoResponse.data.default_branch
      } catch (repoError) {
        if (repoError.status === API_RATE_LIMIT) {
          throw new Error(ERROR_MESSAGE.API_RATE_LIMIT)
        }

        if (repoError.status === INVALID_TOKEN_STATUS) {
          throw new Error(ERROR_MESSAGE.TOKEN_INVALID)
        }

        const pageResponse = await fetch(window.location.href)
        if (pageResponse.status === NOT_FOUND_STATUS) {
          throw new Error(ERROR_MESSAGE.NOT_FOUND_PAGE)
        }

        if (
          pageResponse.status === OK_STATUS &&
          repoError.status === NOT_FOUND_STATUS
        ) {
          throw new Error(ERROR_MESSAGE.NO_PERMISSION)
        }

        throw repoError
      }
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  )

  // This effect handle SPA by listening `pathname`, `data` is used to get default branch only
  useEffect(() => {
    if (!isLoading) {
      setPageInfo(getPageInfo(pathname, defaultBranch, title))
    }
  }, [pathname, defaultBranch, isLoading, title])

  return {
    error,
    isLoading: isLoading || (isEmpty(pageInfo) && !error),
    pageInfo,
  }
}

export default usePageInfo
