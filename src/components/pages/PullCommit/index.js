import React from 'react'
import { useQueryCommit } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'

const PullCommit = ({ owner, commit, repo }) => {
  const { data, isLoading, error } = useQueryCommit({ owner, commit, repo })

  if (isLoading || error) return null

  return <Tree tree={data.files} repo={repo} isExpandedAll />
}

PullCommit.propTypes = {}

export default PullCommit
