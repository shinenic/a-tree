import React from 'react'
import PropTypes from 'prop-types'
import { useQueryPR } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'

const PR = ({ owner, pr, repo }) => {
  const { data, loading } = useQueryPR({ owner, pr, repo })

  if (loading) return null

  console.log('data', data)

  return <Tree tree={data} repo={repo} />
}

PR.propTypes = {}

export default PR
