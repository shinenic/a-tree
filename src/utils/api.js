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
  token = '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',
  placeholders = {},
  params = {},
  options = {},
  method = 'GET',
} = {}) => {
  const controller = new AbortController()

  const promise = request({
    method,
    url,
    ...placeholders,
    ...params,
    ...options,
    request: {
      signal: controller.signal,
    },
    ...(token && {
      headers: { authorization: `token ${token}` },
    }),
  })

  promise.cancel = () => controller.abort()

  return promise
}
