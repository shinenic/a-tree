import {
  useQueryFiles,
  useQueryPull,
  useQueryCommit,
} from 'hooks/api/useGithubQueries'
import { PAGE_TYPE } from 'constants'

const useQueryTree = (pageInfo, enabled = true) => {
  const { pageType, owner, repo, commit, pull, branch } = pageInfo

  const queryPull = useQueryPull(
    { owner, pull, repo },
    {
      enabled:
        enabled && [PAGE_TYPE.PULL_FILES, PAGE_TYPE.PULL].includes(pageType),
    }
  )

  const queryCommit = useQueryCommit(
    { owner, commit, repo },
    {
      enabled:
        enabled &&
        [
          PAGE_TYPE.PULL_COMMIT,
          PAGE_TYPE.PULL_COMMITS,
          PAGE_TYPE.CODE_COMMIT,
        ].includes(pageType),
    }
  )

  const queryFiles = useQueryFiles(
    { owner, branch, repo },
    {
      enabled:
        enabled &&
        ![
          PAGE_TYPE.PULL_FILES,
          PAGE_TYPE.PULL,
          PAGE_TYPE.PULL_COMMIT,
          PAGE_TYPE.PULL_COMMITS,
        ].includes(pageType),
    }
  )

  const queryMap = {
    [PAGE_TYPE.PULL]: queryPull,
    [PAGE_TYPE.PULL_FILES]: queryPull,

    [PAGE_TYPE.PULL_COMMIT]: queryCommit,
    [PAGE_TYPE.PULL_COMMITS]: queryCommit,
    [PAGE_TYPE.CODE_COMMIT]: queryCommit,
  }

  return queryMap[pageType] ?? queryFiles
}

export default useQueryTree
