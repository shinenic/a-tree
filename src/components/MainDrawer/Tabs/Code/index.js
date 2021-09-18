import React from 'react'
import { useQueryFiles } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'
import { linkGithubPage, getFileLink } from 'utils/link'
import Loading from '../Loading'

const Code = ({ owner, branch, repo }) => {
  const { data, isLoading, error } = useQueryFiles({ owner, branch, repo })

  if (error) return null

  if (isLoading) return <Loading />

  const onItemClick = ({ path, type }) => {
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
  }

  return (
    <Tree
      tree={data.tree}
      onItemClick={onItemClick}
      treeId={`${owner}-${repo}-${branch}`}
    />
  )
}

Code.propTypes = {}

export default Code
