import React from 'react'
import { useQueryCommit } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'

const PullCommit = ({ owner, commit, repo }) => {
  const { data, loading, error } = useQueryCommit({ owner, commit, repo })

  if (loading || error) return null

  return (
    <Tree
      tree={data.files}
      isExpandedAll
      treeId={`${owner}-${repo}-${commit}`}
    />
  )
}

PullCommit.propTypes = {}

export default PullCommit
