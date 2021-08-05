import useGithubQuery from './useGithubQuery'

export const useQueryRepoInfo = (
  { owner, repo, ...rest },
  useQueryOptions = {}
) => {
  return useGithubQuery(
    ['repoInfo', { owner, repo }],
    {
      url: '/repos/{owner}/{repo}',
      placeholders: { owner, repo },
      ...rest,
    },
    useQueryOptions
  )
}

export const useQueryCommits = (
  { owner, repo, pull, ...rest },
  useQueryOptions = {}
) => {
  return useGithubQuery(
    ['commits', { owner, repo, pull }],
    {
      url: '/repos/{owner}/{repo}/pulls/{pull}/commits',
      placeholders: { owner, repo, pull },
      ...rest,
    },
    useQueryOptions
  )
}

export const useQueryCommit = (
  { owner, repo, commit, ...rest },
  useQueryOptions = {}
) => {
  return useGithubQuery(
    ['commit', { owner, repo, commit }],
    {
      url: '/repos/{owner}/{repo}/commits/{commit}',
      placeholders: { owner, repo, commit },
      ...rest,
    },
    useQueryOptions
  )
}

export const useQueryPull = (
  { owner, repo, pull, perPage = 100, ...rest },
  useQueryOptions = {}
) => {
  return useGithubQuery(
    ['pull', { owner, repo, pull, perPage }],
    {
      url: '/repos/{owner}/{repo}/pulls/{pull}/files',
      placeholders: { owner, repo, pull },
      params: { per_page: perPage },
      ...rest,
    },
    useQueryOptions
  )
}

export const useQueryPulls = (
  {
    owner,
    repo,
    perPage = 30,
    sort = 'created',
    direction = 'desc',
    state = 'open',
    ...rest
  },
  useQueryOptions = {}
) => {
  return useGithubQuery(
    ['pulls', { owner, repo, perPage, sort, direction, state }],
    {
      url: '/repos/{owner}/{repo}/pulls',
      placeholders: { owner, repo },
      params: {
        sort: 'created',
        direction: 'desc',
        state: 'open',
        per_page: perPage,
      },
      ...rest,
    },
    useQueryOptions
  )
}

export const useQueryFiles = (
  { owner, repo, branch, ...rest },
  useQueryOptions = {}
) => {
  return useGithubQuery(
    ['files', { owner, repo, branch }],
    {
      url: '/repos/{owner}/{repo}/git/trees/{branch}',
      placeholders: { owner, repo, branch },
      params: { recursive: 1 },
      ...rest,
    },
    useQueryOptions
  )
}
