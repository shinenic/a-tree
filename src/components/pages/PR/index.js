import React from 'react'
import { useQueryPR } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'

const PR = ({ owner, pull, repo }) => {
  const { data, loading } = useQueryPR({ owner, pull, repo })

  if (loading) return null

  return <Tree tree={data} repo={repo} isExpandedAll />
}

PR.propTypes = {}

export default PR
