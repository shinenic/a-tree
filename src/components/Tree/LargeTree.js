import { useMemo, useCallback } from 'react'
import { sortBy, isEmpty } from 'lodash'
import { FixedSizeTree } from 'react-vtree'
import AutoSizer from 'react-virtualized-auto-sizer'

import useQueryLargeTree from 'hooks/tree/useQueryLargeTree'
import { generateTree } from 'utils/tree'

import TreeItem from './Item'

const getNodeData = ({
  queryBySha,
  name,
  node,
  nestingLevel,
  defaultOpen,
  onItemClick,
  getNodeHref,
}) => {
  const { id } = node
  return {
    data: {
      queryBySha,
      id,
      isLeaf: node.type === 'blob',
      isOpenByDefault: defaultOpen,
      name,
      nestingLevel,
      onItemClick,
      getNodeHref,
      meta: node,
    },
    nestingLevel,
    node,
  }
}

function LargeTree({ onItemClick, getNodeHref, owner, repo, branch }) {
  const { files, queryBySha } = useQueryLargeTree({
    owner,
    repo,
    branch,
  })

  // Disable auto merge proxy node to keep the order of the tree
  const [objTree] = useMemo(() => generateTree(files, false), [files])

  // ref: https://github.com/Lodin/react-vtree#usage
  const treeWalker = useCallback(
    function* treeWalker() {
      const rootEntries = sortBy(Object.entries(objTree), [
        ([, node]) => (node.type === 'tree' || !isEmpty(node.children) ? 0 : 1),
      ])

      for (let i = 0; i < rootEntries.length; i += 1) {
        const [name, node] = rootEntries[i]

        yield getNodeData({
          queryBySha,
          name,
          node,
          nestingLevel: 0,
          defaultOpen: false,
          onItemClick,
          getNodeHref,
        })
      }

      while (true) {
        const parent = yield

        const childrenEntries = parent.node.children
          ? sortBy(Object.entries(parent.node.children), [
              ([, node]) =>
                node.type === 'tree' || !isEmpty(node.children) ? 0 : 1,
            ])
          : []

        for (let i = 0; i < childrenEntries.length; i += 1) {
          const [name, node] = childrenEntries[i]

          yield getNodeData({
            queryBySha,
            name,
            node,
            nestingLevel: parent.nestingLevel + 1,
            defaultOpen: false,
            onItemClick,
            getNodeHref,
          })
        }
      }
    },
    [objTree, queryBySha, onItemClick, getNodeHref]
  )

  const isDataEmpty = isEmpty(files)
  const memoedTree = useMemo(
    () =>
      // @note There should be at least one root node
      isDataEmpty ? null : (
        <AutoSizer>
          {({ height, width }) => {
            return (
              <FixedSizeTree
                treeWalker={treeWalker}
                itemSize={34}
                height={height}
                width={width}
                async
              >
                {TreeItem}
              </FixedSizeTree>
            )
          }}
        </AutoSizer>
      ),
    [treeWalker, isDataEmpty]
  )

  return memoedTree
}

export default LargeTree
