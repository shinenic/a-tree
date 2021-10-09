import { useCallback } from 'react'
import { useQueryFiles } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'
import { linkGithubPage, getFileLink } from 'utils/link'
import FileSearchModal from 'components/FileSearchModal'
import Loading from '../Loading'

const Code = ({ owner, branch, repo }) => {
  const { data, isLoading, error } = useQueryFiles({ owner, branch, repo })

  const onItemClick = useCallback(
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

  if (error) return null

  return (
    <>
      <FileSearchModal
        files={data?.tree}
        isLoading={isLoading}
        selectCallback={onItemClick}
      />
      {isLoading || !data ? (
        <Loading />
      ) : (
        <Tree
          tree={data.tree}
          onItemClick={onItemClick}
          treeId={`${owner}-${repo}-${branch}`}
        />
      )}
    </>
  )
}

export default Code
