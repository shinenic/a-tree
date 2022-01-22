import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { sortBy, isEmpty } from 'lodash'
import { FixedSizeTree } from 'react-vtree'
import AutoSizer from 'react-virtualized-auto-sizer'
import { generateTree } from 'utils/tree'

import TreeItem from './Item'
import TreeItemPlaceholder from './Item/Placeholder'

const getNodeData = ({ name, node, nestingLevel, defaultOpen, onItemClick, getNodeHref }) => {
  const { id, children } = node
  return {
    data: {
      id,
      isLeaf: !children || isEmpty(children),
      isOpenByDefault: defaultOpen,
      name,
      nestingLevel,
      onItemClick,
      getNodeHref,
      meta: node
    },
    nestingLevel,
    node
  }
}

function Tree({
  tree,
  isExpandedAll = false,
  onItemClick,
  isLoading,
  currentFilePath,
  getNodeHref
}) {
  const lastProcessedPath = useRef(null) // To handle automatic expanding / collapsing
  const [treeInstance, setTreeInstance] = useState(/** @type {FixedSizeTree} */ (null))

  const [objTree, folderNodeIds] = useMemo(() => generateTree(tree), [tree])

  // ref: https://github.com/Lodin/react-vtree#usage
  const treeWalker = useCallback(
    function* treeWalker() {
      const rootEntries = sortBy(Object.entries(objTree), [([, node]) => isEmpty(node?.children)])

      for (let i = 0; i < rootEntries.length; i += 1) {
        const [name, node] = rootEntries[i]

        yield getNodeData({
          name,
          node,
          nestingLevel: 0,
          defaultOpen: isExpandedAll,
          onItemClick,
          getNodeHref
        })
      }

      while (true) {
        const parent = yield

        const childrenEntries = parent.node.children
          ? sortBy(Object.entries(parent.node.children), [([, node]) => isEmpty(node?.children)])
          : []

        for (let i = 0; i < childrenEntries.length; i += 1) {
          const [name, node] = childrenEntries[i]

          yield getNodeData({
            name,
            node,
            nestingLevel: parent.nestingLevel + 1,
            defaultOpen: isExpandedAll,
            onItemClick,
            getNodeHref
          })
        }
      }
    },
    [objTree, isExpandedAll, onItemClick, getNodeHref]
  )

  // treeInstance will be set asynchronously, so store it in a state instead of ref
  useEffect(() => {
    if (!treeInstance) return
    if (isExpandedAll) return
    if (currentFilePath === lastProcessedPath.current) return
    if (!currentFilePath && !lastProcessedPath.current) return

    // Back to the root
    if (!currentFilePath && lastProcessedPath.current) {
      const allClosedTreeMap = folderNodeIds.reduce((result, id) => {
        result[id] = { open: false }
        return result
      }, {})

      treeInstance.recomputeTree(allClosedTreeMap)

      lastProcessedPath.current = currentFilePath
      return
    }

    const targetPaths = currentFilePath.split('/')
    const targetIds = targetPaths.map((_, index) => targetPaths.slice(0, index + 1).join('/'))

    const treeMap = targetIds.reduce((result, id, index) => {
      if (index === targetIds.length - 1) {
        return {
          ...result,
          [id]: {
            open: true,
            subtreeCallback(node, ownerNode) {
              if (node !== ownerNode) {
                node.isOpen = false
              }
            }
          }
        }
      }

      return { ...result, [id]: { open: true } }
    }, {})

    const scrollItemIntoView = async () => {
      await treeInstance.recomputeTree(treeMap)

      /** @see https://github.com/Lodin/react-vtree#methods */
      treeInstance.scrollToItem(currentFilePath, 'smart')
    }

    scrollItemIntoView()

    lastProcessedPath.current = currentFilePath
  }, [currentFilePath, treeInstance]) // eslint-disable-line

  const memoedTree = useMemo(
    () => (
      <AutoSizer>
        {({ height, width }) => {
          return (
            <FixedSizeTree
              treeWalker={treeWalker}
              itemSize={34}
              height={height}
              width={width}
              ref={setTreeInstance}
            >
              {isLoading ? TreeItemPlaceholder : TreeItem}
            </FixedSizeTree>
          )
        }}
      </AutoSizer>
    ),
    [treeWalker, isLoading]
  )

  return memoedTree
}

export default Tree
