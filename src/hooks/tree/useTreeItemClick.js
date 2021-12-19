import { PAGE_TYPE } from 'constants/base'
import { useCallback } from 'react'
import { linkGithubPage, getFileLink } from 'utils/link'
import useLinkPullFile from 'hooks/setting/useLinkPullFile'

const useTreeItemClick = (pageInfo) => {
  const { pageType, owner, repo, commit, pull, branch } = pageInfo

  const onCodeTreeItemClick = useCallback(
    ({ path, type }) => {
      if (type === 'tree') return

      linkGithubPage(
        getFileLink({
          owner,
          repo,
          branch,
          type,
          filePath: path,
        })
      )
    },
    [owner, branch, repo]
  )

  const onCommitTreeItemClick = useLinkPullFile({
    basePathname: `/${owner}/${repo}/commit/${commit}`,
    pageType,
  })

  const onPullTreeItemClick = useLinkPullFile({
    basePathname: `/${owner}/${repo}/pull/${pull}/files`,
    pageType,
  })

  const onPullCommitTreeItemClick = useLinkPullFile({
    basePathname: `/${owner}/${repo}/pull/${pull}/commits/${commit}`,
    pageType: PAGE_TYPE.PULL_COMMIT,
  })

  const onPullCommitsTreeItemClick = useLinkPullFile({
    basePathname: `/${owner}/${repo}/pull/${pull}/commits/${commit?.[0]}..${commit?.[1]}`,
    pageType,
  })

  const queryMap = {
    [PAGE_TYPE.PULL]: onPullTreeItemClick,
    [PAGE_TYPE.PULL_FILES]: onPullTreeItemClick,

    [PAGE_TYPE.PULL_COMMIT]: onPullCommitTreeItemClick,
    [PAGE_TYPE.PULL_COMMITS]: onPullCommitsTreeItemClick,

    [PAGE_TYPE.CODE_COMMIT]: onCommitTreeItemClick,
  }

  return queryMap[pageType] ?? onCodeTreeItemClick
}

export default useTreeItemClick
