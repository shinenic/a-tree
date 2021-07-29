import useGithubQuery from './useGithubQuery'

export const useQueryRepoInfo = ({ owner, repo, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}',
    placeholders: { owner, repo },
    ...rest,
  })
}

export const useQueryCommits = ({ owner, repo, pull, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/pulls/{pull}/commits',
    placeholders: { owner, repo, pull },
    ...rest,
  })
}

export const useQueryCommit = ({ owner, repo, commit, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/commits/{commit}',
    placeholders: { owner, repo, commit },
    ...rest,
  })
}

export const useQueryPull = ({ owner, repo, pull, perPage = 100, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/pulls/{pull}/files',
    placeholders: { owner, repo, pull },
    params: { per_page: perPage },
    ...rest,
  })
}

export const useQueryPulls = ({
  owner,
  repo,
  perPage = 30,
  sort = 'created',
  direction = 'desc',
  state = 'open',
  ...rest
}) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/pulls',
    placeholders: { owner, repo },
    params: {
      sort: 'created',
      direction: 'desc',
      state: 'open',
      per_page: perPage,
    },
    ...rest,
  })
}

export const useQueryFiles = ({ owner, repo, branch, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/git/trees/{branch}',
    placeholders: { owner, repo, branch },
    params: { recursive: 1 },
    ...rest,
  })
}
