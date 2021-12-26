import { request } from '@octokit/request'
import { isLocalMode, localAPIPort } from 'constants/base'

export const isValidQuery = (url, placeholders) => {
  if (!url || url.length === 0) return false
  const urlKeys = url.match(/{\w+}/g).map((str) => str.slice(1, -1))

  return urlKeys.every((key) => placeholders[key])
}

/**
 * @example - get commits from one pull request
 * https://api.github.com/repos/microsoft/fluentui/pulls/18787/commits?page=2
 *
 * const promise = createGithubQuery({
 *   url: '/repos/{owner}/{repo}/pulls/{pull_number}/commits'
 *   placeholders: {
 *     owner: 'microsoft',
 *     repo: 'fluentui',
 *     pull_number: '18787'
 *   },
 *   params: { page: 2 },
 * })
 */
export const createGithubQuery = ({
  url,
  token,
  placeholders = {},
  params = {},
  options = {},
  method = 'GET',
  baseUrl
} = {}) => {
  const controller = new AbortController()
  const customParams = { ...params, ts: new Date().getTime() }

  const promise = request({
    ...(baseUrl && { baseUrl }),
    ...(isLocalMode && { baseUrl: `http://localhost:${localAPIPort}` }),
    method,
    url,
    ...placeholders,
    ...customParams,
    ...options,
    request: {
      signal: controller.signal
    },
    ...(token && {
      headers: { authorization: `token ${token}` }
    })
  })

  promise.cancel = () => controller.abort()

  return promise
}
