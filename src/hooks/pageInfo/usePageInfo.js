import { useState, useEffect } from 'react'
import { getPageInfo } from 'utils/github'
import { useSettingCtx } from 'components/Setting/Context/Provider'
import { createGithubQuery } from 'utils/api'
import { ERROR_MESSAGE } from 'constants'

import useListenLocation from 'hooks/pageInfo/useListenLocation'
import useListenTitle from 'hooks/pageInfo/useListenTitle'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

const NOT_FOUND_STATUS = 404
const INVALID_TOKEN_STATUS = 401
const OK_STATUS = 200

/**
 * This hook return pageInfo if the page is supported,
 * to get the necessary data, we need 3 thing to ensure the full page info.
 * 1. default branch - this value will come from `repo info api` response,
 *    (repo info api)  the api can also be used to check whether the page(pathname) is under a `accessible` repository,
 * 2. pathname - from url listener
 * 3. title    - from dom listener
 *
 * For the error message, check the response of api whether `OK` first,
 *   if not => check if the word of owner is reserved ('setting', 'pulls', etc.).
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
  const { token } = useSettingCtx()
  const { pathname } = useListenLocation()
  const [_, firstPath, secondPath] = pathname.split('/')
  const title = useListenTitle()
  const [pageInfo, setPageInfo] = useState({})

  const {
    data: defaultBranch,
    isLoading,
    error,
  } = useQuery(
    ['pageInfo', { owner: firstPath, repo: secondPath, token }],
    async () => {
      if (!secondPath || !firstPath) {
        throw new Error(ERROR_MESSAGE.NOT_SUPPORTED_PAGE)
      }
      try {
        const repoResponse = await createGithubQuery({
          url: '/repos/{owner}/{repo}',
          placeholders: { owner: firstPath, repo: secondPath },
          token,
        })
        return repoResponse.data.default_branch
      } catch (repoError) {
        try {
          await createGithubQuery({
            url: '/users/{owner}',
            placeholders: { owner: firstPath },
            token,
          })
        } catch (userError) {
          if (userError.status === NOT_FOUND_STATUS) {
            throw new Error(ERROR_MESSAGE.RESERVED_USER_NAME)
          }
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
    if (defaultBranch) {
      setPageInfo(getPageInfo(pathname, defaultBranch, title))
    }
  }, [pathname, defaultBranch])

  return {
    error,
    isLoading: isLoading || (isEmpty(pageInfo) && !error),
    pageInfo,
  }
}

export default usePageInfo
