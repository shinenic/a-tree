const { graphql } = require('@octokit/graphql')

const createGithubGqlQuery = async (token, queryString, options = {}) => {
  const controller = new AbortController()

  const promise = await graphql(queryString, {
    headers: {
      authorization: `token ${token}`,
    },
    request: {
      signal: controller.signal,
    },
    ...options,
  })

  promise.cancel = () => controller.abort()

  return promise
}

export default createGithubGqlQuery
