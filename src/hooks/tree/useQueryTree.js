import {
  useQueryFiles,
  useQueryPull,
  useQueryCommit,
} from 'hooks/api/useGithubQueries'
import { useMemo } from 'react'
import {
  PAGE_TYPE,
  PAGES_WITH_BRANCH_TREE,
  PULL_PAGE_TYPE,
  PAGES_WITH_FULL_PULL_TREE,
} from 'constants'

const useQueryTree = (pageInfo, enabled = true) => {
  const { pageType, owner, repo, commit, pull, branch } = pageInfo

  const queryPull = useQueryPull(
    { owner, pull, repo },
    { enabled: enabled && PAGES_WITH_FULL_PULL_TREE.includes(pageType) }
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
    { enabled: enabled && PAGES_WITH_BRANCH_TREE.includes(pageType) }
  )

  const queryMap = {
    [PAGE_TYPE.PULL]: queryPull,
    [PAGE_TYPE.PULL_FILES]: queryPull,

    [PAGE_TYPE.PULL_COMMIT]: queryCommit,
    [PAGE_TYPE.PULL_COMMITS]: queryCommit,
    [PAGE_TYPE.CODE_COMMIT]: queryCommit,
  }

  const { data, isLoading, error } = queryMap[pageType] ?? queryFiles

  const hasData = Boolean(data)
  const files = useMemo(
    /**
     * @note Files in each different API
     *  commit: data.files
     *  code:   data.tree
     *  pull:   data
     */
    () => data?.files || data?.tree || data,
    [pageType, owner, repo, commit, pull, branch, hasData] // eslint-disable-line
  )

  return {
    files,
    isLoading,
    error,
    isLargeRepoTree: data?.truncated && !PULL_PAGE_TYPE[pageType],
  }
}

export default useQueryTree
