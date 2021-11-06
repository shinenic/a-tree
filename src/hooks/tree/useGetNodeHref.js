import { PAGE_TYPE } from 'constants'
import { useMemo } from 'react'
import { getFileHashId } from 'utils/pullPage'

const useGetNodeHref = (pageInfo) => {
  const { pageType, owner, repo, commit, pull, branch } = pageInfo

  const getNodeHref = useMemo(() => {
    const getPullNodeHref = ({ filename }) =>
      `/${owner}/${repo}/pull/${pull}/files/#${getFileHashId(filename)}`

    const getPullCommitNodeHref = ({ filename }) =>
      `/${owner}/${repo}/pull/${pull}/commits/${commit}#${getFileHashId(
        filename
      )}`

    const getCodeNodeHref = ({ path }) =>
      `/${owner}/${repo}/blob/${branch}/${path}`

    const getCodeCommitNodeHref = ({ filename }) =>
      `/${owner}/${repo}/commit/${commit}#${getFileHashId(filename)}`

    const queryMap = {
      [PAGE_TYPE.PULL]: getPullNodeHref,
      [PAGE_TYPE.PULL_FILES]: getPullNodeHref,

      [PAGE_TYPE.PULL_COMMIT]: getPullCommitNodeHref,
      [PAGE_TYPE.PULL_COMMITS]: getPullCommitNodeHref,

      [PAGE_TYPE.CODE_COMMIT]: getCodeCommitNodeHref,
    }

    return queryMap[pageType] ?? getCodeNodeHref
  }, [pageType, owner, repo, commit, pull, branch])

  return getNodeHref
}

export default useGetNodeHref