import React from 'react'
import { useQueryPull } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'

const PR = ({ owner, pull, repo }) => {
  const { data, loading } = useQueryPull({ owner, pull, repo })

  if (loading) return null

  return <Tree tree={data} repo={repo} isExpandedAll />
}

PR.propTypes = {}

export default PR