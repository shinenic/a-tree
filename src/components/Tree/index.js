import { useMemo, useEffect, useCallback, useRef } from 'react'
import { sortBy, isEmpty, compact, get, set } from 'lodash'
import { FixedSizeTree } from 'react-vtree'
import usePrevious from 'hooks/usePrevious'
import AutoSizer from 'react-virtualized-auto-sizer'

import TreeItem, { TreeItemPlaceholder } from './Item'

export const DRAWER_CONTENT_ID = 'a-tree-tab-content'

const generateTree = (tree) => {
  const objTree = tree.reduce((result, node) => {
    const originalPath = node.path || node.filename
    const pathArray = originalPath.split('/')
    const path = pathArray.join('/children/').split('/')

    if (!get(result, path)) {
      return set(result, path, node)
    }

    return result
  }, {})

  const folderNodeIds = []
  setNodeIds(objTree, null, folderNodeIds)

  return [objTree, folderNodeIds]
}

const isProxyNode = (node) => {
  const hasChildNoSiblings = Object.keys(node.children).length === 1

  if (!hasChildNoSiblings) return false

  const childKey = Object.keys(node.children)[0]
  const child = node.children[childKey]
  const isChildLeaf = isEmpty(child.children)

  return !isChildLeaf
}

const setNodeIds = (tree, parentNodeId = '', folderNodeIds) => {
  return Object.keys(tree).map((key) => {
    let node = tree[key]
    let label = key

    const hasChildren = !isEmpty(node.children)
    let id = compact([parentNodeId, key]).join('/')

    node.id = id

    if (hasChildren) {
      while (isProxyNode(node)) {
        const childKey = Object.keys(node.children)[0]
        const child = node.children[childKey]

        delete tree[label]

        label = `${label}/${childKey}`

        tree[label] = child
        node = tree[label]

        id = compact([parentNodeId, label]).join('/')
        node.id = id
      }

      folderNodeIds.push(id)
      return setNodeIds(node.children, id, folderNodeIds)
    }

    return id
  })
}

const getNodeData = ({
  name,
  node,
  nestingLevel,
  defaultOpen,
  onItemClick,
  getNodeHref,
}) => {
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
      meta: node,
    },
    nestingLevel,
    node,
  }
}

export default function CustomizedTreeView({
  tree,
  isExpandedAll = false,
  onItemClick,
  isLoading,
  currentFilePath,
  getNodeHref,
}) {
  const treeInstance = useRef(null)
  const prevCurrentFilePath = usePrevious(currentFilePath)

  const [objTree, folderNodeIds] = useMemo(() => generateTree(tree), [tree])

  // ref: https://github.com/Lodin/react-vtree#usage
  const treeWalker = useCallback(
    function* treeWalker() {
      const rootEntries = sortBy(Object.entries(objTree), [
        ([, node]) => isEmpty(node?.children),
      ])

      for (let i = 0; i < rootEntries.length; i += 1) {
        const [name, node] = rootEntries[i]

        yield getNodeData({
          name,
          node,
          nestingLevel: 0,
          defaultOpen: isExpandedAll,
          onItemClick,
          getNodeHref,
        })
      }

      while (true) {
        const parent = yield

        const childrenEntries = parent.node.children
          ? sortBy(Object.entries(parent.node.children), [
              ([, node]) => isEmpty(node?.children),
            ])
          : []

        for (let i = 0; i < childrenEntries.length; i += 1) {
          const [name, node] = childrenEntries[i]

          yield getNodeData({
            name,
            node,
            nestingLevel: parent.nestingLevel + 1,
            defaultOpen: isExpandedAll,
            onItemClick,
            getNodeHref,
          })
        }
      }
    },
    [objTree, isExpandedAll, onItemClick, getNodeHref]
  )

  useEffect(() => {
    if (isExpandedAll) return

    if (!currentFilePath && !prevCurrentFilePath) return

    if (!currentFilePath && prevCurrentFilePath) {
      const allClosedTreeMap = folderNodeIds.reduce((result, key) => {
        result[key] = { open: false }
        return result
      }, {})

      treeInstance.current.recomputeTree(allClosedTreeMap)
      return
    }

    treeInstance.current.recomputeTree({
      [currentFilePath]: {
        open: true,
        subtreeCallback(node, ownerNode) {
          if (node !== ownerNode) {
            node.isOpen = false
          }
        },
      },
    })
  }, [currentFilePath, isExpandedAll]) // eslint-disable-line

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
              ref={treeInstance}
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
