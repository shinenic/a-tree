import React from 'react'
import PropTypes from 'prop-types'
import { useQueryPR } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'

const PR = ({ owner, pull, repo }) => {
  const { data, loading } = useQueryPR({ owner, pull, repo })

  if (loading) return null

  return <Tree tree={data} repo={repo} />
}

PR.propTypes = {}

export default PR
