import { useState, useCallback } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { request } from '@octokit/request'

export const isValidQuery = (url, placeholders) => {
  if (!url || url.length === 0) return false
  const urlKeys = url.match(/{\w+}/g).map((str) => str.slice(1, -1))

  return urlKeys.every((key) => placeholders[key])
}

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
  enabled = true,
} = {}) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(
    () => url && enabled && isValidQuery(url, placeholders)
  )

  const resetStates = useCallback(() => {
    setLoading(true)
    setError(null)
    setData(null)
  }, [])

  useDeepCompareEffect(() => {
    if (!url || !enabled || !isValidQuery(url, placeholders)) return

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

        if (result?.data?.message) {
          setError(result?.data?.message)
        } else {
          setData(result?.data)
        }
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    resetStates()
    startQuery()

    return () => abortCtrl.abort()
  }, [url, token, placeholders, params, options, method, enabled])

  return { data, loading, error }
}

export default useGithubQuery
