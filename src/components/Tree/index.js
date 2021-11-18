import { useMemo, useEffect, useCallback, useRef, useState } from 'react'
import { sortBy, keyBy } from 'lodash'
import { FixedSizeTree } from 'react-vtree'
import usePrevious from 'hooks/usePrevious'
import AutoSizer from 'react-virtualized-auto-sizer'

import TreeItem from './Item'

export const DRAWER_CONTENT_ID = 'a-tree-tab-content'

const generateSortableTree = (tree = []) => {
  const splittedFiles = tree.map(({ path, filename }) => {
    return (filename || path).split('/')
  })

  const result = buildParent(splittedFiles)

  const treeMap = keyBy(tree, tree[0].filename ? 'filename' : 'path')

  return [result, treeMap]
}

const buildParent = (availableNodes = [], depth = 0, currentPath = '') => {
  if (availableNodes.length === 0) return []

  const currentLevelNames = [
    ...new Set(availableNodes.map((file) => file[depth])),
  ]

  const result = []
  currentLevelNames.forEach((name) => {
    const fullPath = currentPath ? `${currentPath}/${name}` : name

    const nextLevelNodes = availableNodes.filter(
      (paths) => paths[depth] === name && paths[depth + 1]
    )

    result.push({
      id: fullPath,
      name,
      children:
        nextLevelNodes.length === 0
          ? []
          : buildParent(nextLevelNodes, depth + 1, fullPath),
    })
  })

  return sortBy(result, [(node) => !node?.children?.length])
}

const getNodeData = ({
  node,
  nestingLevel,
  meta,
  defaultOpen,
  onItemClick,
  getNodeHref,
}) => ({
  data: {
    id: node.id,
    isLeaf: !node?.children?.length,
    isOpenByDefault: defaultOpen,
    name: node.name,
    nestingLevel,
    onItemClick,
    getNodeHref,
    meta,
  },
  nestingLevel,
  node,
})

export default function CustomizedTreeView({
  tree,
  isExpandedAll = false,
  onItemClick,
  isLoading,
  currentFilePath,
  getNodeHref,
}) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const treeInstance = useRef(null)
  const prevCurrentFilePath = usePrevious(currentFilePath)

  const [fullTreeNodes, treeMap] = useMemo(
    () => generateSortableTree(tree),
    [tree]
  )

  // ref: https://github.com/Lodin/react-vtree#usage
  const treeWalker = useCallback(
    function* treeWalker() {
      for (let i = 0; i < fullTreeNodes.length; i += 1) {
        yield getNodeData({
          node: fullTreeNodes[i],
          nestingLevel: 0,
          meta: treeMap[fullTreeNodes[i].id],
          defaultOpen: isExpandedAll,
          onItemClick,
          getNodeHref,
        })
      }

      while (true) {
        const parent = yield

        for (let i = 0; i < parent.node.children.length; i += 1) {
          yield getNodeData({
            node: parent.node.children[i],
            nestingLevel: parent.nestingLevel + 1,
            meta: treeMap[parent.node.children[i].id],
            defaultOpen: isExpandedAll,
            onItemClick,
            getNodeHref,
          })
        }
      }
    },
    [fullTreeNodes, treeMap, isExpandedAll, onItemClick, getNodeHref]
  )

  useEffect(() => {
    const target = document.getElementById(DRAWER_CONTENT_ID)
    if (!target) return

    const resizeObserver = new ResizeObserver(() => {
      const rect = target.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
    })

    resizeObserver.observe(target)

    return () => resizeObserver.unobserve(target)
  }, [])

  useEffect(() => {
    if (isExpandedAll) return

    if (!currentFilePath && !prevCurrentFilePath) return

    if (!currentFilePath && prevCurrentFilePath) {
      const allClosedTreeMap = Object.keys(treeMap).reduce((result, key) => {
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
              {TreeItem}
            </FixedSizeTree>
          )
        }}
      </AutoSizer>
    ),
    [treeWalker]
  )

  return memoedTree
}
