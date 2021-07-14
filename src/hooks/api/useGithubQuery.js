import { useState, useCallback } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { request } from '@octokit/request'

/**
 * @example - get commits from one pull request
 * https://api.github.com/repos/microsoft/fluentui/pulls/18787/commits?page=2
 *
 * const { data, error, loading } = useGithubQuery({
 *   url: '/repos/{owner}/{repo}/pulls/{pull_number}/commits'
 *   placeholders: {
 *     owner: 'microsoft',
 *     repo: 'fluentui',
 *     pull_number: '18787'
 *   },
 *   params: { page: 2 },
 * })
 */
const useGithubQuery = ({
  url,
  token,
  placeholders = {},
  params = {},
  options = {},
  method = 'GET',
} = {}) => {
  const [data, setData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)

  const resetStates = useCallback(() => {
    setLoading(true)
    setError(null)
    setData(null)
  }, [])

  useDeepCompareEffect(() => {
    const abortCtrl = new AbortController()

    const startQuery = async () => {
      try {
        const result = await request({
          method,
          url,
          ...placeholders,
          ...params,
          ...options,
          request: {
            signal: abortCtrl.signal,
          },
          ...(token && {
            headers: { authorization: `token ${token}` },
          }),
        })

        setData(result?.data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    resetStates()
    startQuery()

    return () => abortCtrl.abort()
  }, [url, token, placeholders, params, options, method])

  return { data, loading, error }
}

export default useGithubQuery
