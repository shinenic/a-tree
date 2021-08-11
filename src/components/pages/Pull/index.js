import React from 'react'
import { useQueryPull } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'

const Pull = ({ owner, pull, repo }) => {
  const { data, isLoading } = useQueryPull({ owner, pull, repo })

  if (isLoading) return null

  return <Tree tree={data} isExpandedAll treeId={`${owner}-${repo}-${pull}`} />
}

Pull.propTypes = {}

export default Pull
