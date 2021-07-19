import React from 'react'
import PropTypes from 'prop-types'
import { useQueryFiles } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'

const Code = ({ owner, branch, repo }) => {
  const { data, loading } = useQueryFiles({ owner, branch, repo })

  if (loading) return null

  return <Tree tree={data.tree} />
}

Code.propTypes = {}

export default Code
