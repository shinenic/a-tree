import React from 'react'
import Tree from 'components/Tree'
import { placeholderDeepTree, placeholderFlattenTree } from './placeholder'

const Loading = ({ isExpandedAll = false }) => {
  return (
    <Tree
      isLoading
      tree={isExpandedAll ? placeholderDeepTree : placeholderFlattenTree}
      isExpandedAll={isExpandedAll}
    />
  )
}

export default Loading
