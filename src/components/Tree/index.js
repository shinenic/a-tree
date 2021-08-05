import React, { useMemo } from 'react'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from './Item'
import { get, set, isEmpty, sortBy, compact } from 'lodash'
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFileText,
} from 'react-icons/ai'
import { MAIN_COLOR } from './constants'
import LabelIcon from './LabelIcon'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
})

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

  let folderNodeIds = []
  setNodeIds(objTree, null, folderNodeIds)

  return [objTree, folderNodeIds]
}

const setNodeIds = (tree, parentNodeId = '', folderNodeIds) => {
  return Object.keys(tree).map((key) => {
    let node = tree[key]

    const hasChildren = !isEmpty(node.children)
    const nodeId = compact([parentNodeId, key]).join('/')

    node.nodeId = nodeId

    if (hasChildren) {
      folderNodeIds.push(nodeId)
      return setNodeIds(node.children, nodeId, folderNodeIds)
    }

    return nodeId
  })
}

const isProxyNode = (node) => {
  const hasChildNoSiblings = Object.keys(node.children).length === 1

  if (!hasChildNoSiblings) return false

  const childKey = Object.keys(node.children)[0]
  const child = node.children[childKey]
  const isChildLeaf = isEmpty(child.children)

  if (isChildLeaf) return false

  return true
}

const renderTree = (tree, onItemClick) => {
  if (isEmpty(tree)) return null

  return sortBy(Object.keys(tree), [
    (key) => {
      if (tree[key].children) return 0
      else return 1
    },
  ]).map((key) => {
    let node = tree[key]
    let label = key

    const hasChildren = !isEmpty(node.children)
    const status = node.status || 'normal'

    const handleClick = (e) => {
      if (onItemClick) onItemClick(node, e)
    }

    if (hasChildren) {
      while (isProxyNode(node)) {
        const childKey = Object.keys(node.children)[0]
        const child = node.children[childKey]

        label = `${label}/${childKey}`

        tree[label] = child
        node = tree[label]
      }

      return (
        <div key={node.nodeId} onClick={handleClick}>
          <TreeItem nodeId={node.nodeId} label={label}>
            {renderTree(node.children, onItemClick)}
          </TreeItem>
        </div>
      )
    }

    return (
      <div key={node.nodeId} onClick={handleClick}>
        <TreeItem
          nodeId={node.nodeId}
          label={key}
          icon={<LabelIcon status={status} />}
        />
      </div>
    )
  })
}

export default function CustomizedTreeView({
  tree,
  isExpandedAll = false,
  onItemClick,
  treeId,
}) {
  const classes = useStyles()

  const treeView = useMemo(() => {
    const [objectTree, expandedNodeIds] = generateTree(tree)

    return (
      <TreeView
        className={classes.root}
        defaultExpanded={isExpandedAll ? expandedNodeIds : []}
        defaultCollapseIcon={<AiFillFolderOpen color={MAIN_COLOR} />}
        defaultExpandIcon={<AiFillFolder color={MAIN_COLOR} />}
        defaultEndIcon={<AiOutlineFileText color={MAIN_COLOR} />}
      >
        {renderTree(objectTree, onItemClick)}
      </TreeView>
    )
  }, [treeId])

  return treeView
}
