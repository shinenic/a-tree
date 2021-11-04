import { useMemo, useEffect, useState } from 'react'
import TreeView from '@material-ui/lab/TreeView'
import { get, set, isEmpty, sortBy, compact } from 'lodash'
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFileText,
} from 'react-icons/ai'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  LabelTextSkeleton,
  IconSkeleton,
} from 'components/MainDrawer/Tabs/Loading/placeholder'
import tinycolor from 'tinycolor2'
import EllipsisBox from 'components/EllipsisBox'
import TreeItem from './Item'
import { MAIN_COLOR } from './constants'
import LabelIcon from './LabelIcon'

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
})

const getDefaultIcon = (isLoading, theme) => {
  const getIconColor = (color) => {
    return theme.palette.type === 'dark'
      ? tinycolor(color).brighten(60).toHexString()
      : color
  }

  return isLoading
    ? {
        defaultCollapseIcon: <IconSkeleton />,
        defaultExpandIcon: <IconSkeleton />,
        defaultEndIcon: <IconSkeleton />,
      }
    : {
        defaultCollapseIcon: (
          <AiFillFolderOpen color={getIconColor(MAIN_COLOR)} />
        ),
        defaultExpandIcon: <AiFillFolder color={getIconColor(MAIN_COLOR)} />,
        defaultEndIcon: <AiOutlineFileText color={getIconColor(MAIN_COLOR)} />,
      }
}

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
    let nodeId = compact([parentNodeId, key]).join('/')

    node.nodeId = nodeId

    if (hasChildren) {
      while (isProxyNode(node)) {
        const childKey = Object.keys(node.children)[0]
        const child = node.children[childKey]

        delete tree[label]

        label = `${label}/${childKey}`

        tree[label] = child
        node = tree[label]

        nodeId = compact([parentNodeId, label]).join('/')
        node.nodeId = nodeId
      }

      folderNodeIds.push(nodeId)
      return setNodeIds(node.children, nodeId, folderNodeIds)
    }

    return nodeId
  })
}

const Tree = ({ tree, onItemClick, isLoading }) => {
  if (isEmpty(tree)) return null

  return sortBy(Object.keys(tree), [
    (key) => {
      if (tree[key].children) return 0
      return 1
    },
  ]).map((key) => {
    const node = tree[key]
    const label = key
    const hasChildren = !isEmpty(node.children)
    const status = node.status || 'normal'

    const handleClick = (e) => {
      e.stopPropagation()

      if (onItemClick) onItemClick(node, e)
    }

    const handleNodeClick = (e) => {
      if (isLoading) {
        e.preventDefault()
      }
    }

    const Text = () => {
      return <EllipsisBox maxWidth="100%" text={label} withTooltip />
    }

    if (hasChildren) {
      return (
        <div key={node.nodeId} onClick={handleClick}>
          <TreeItem
            nodeId={node.nodeId}
            label={isLoading ? <LabelTextSkeleton /> : <Text />}
            onIconClick={handleNodeClick}
            onLabelClick={handleNodeClick}
          >
            <Tree
              tree={node.children}
              onItemClick={onItemClick}
              isLoading={isLoading}
            />
          </TreeItem>
        </div>
      )
    }

    const originalPath = node.path || node.filename
    return (
      <div key={node.nodeId} onClick={handleClick}>
        <TreeItem
          nodeId={node.nodeId}
          originalPath={originalPath}
          label={isLoading ? <LabelTextSkeleton /> : <Text />}
          icon={isLoading ? <IconSkeleton /> : <LabelIcon status={status} />}
        />
      </div>
    )
  })
}

export default function CustomizedTreeView({
  tree,
  isExpandedAll = false,
  onItemClick,
  isLoading,
  currentFilePath,
}) {
  const [expandedIds, setExpandedIds] = useState([])
  const theme = useTheme()
  const classes = useStyles()

  const [objectTree, folderNodeIds] = useMemo(() => generateTree(tree), [tree])

  useEffect(() => {
    setExpandedIds(isExpandedAll ? [...folderNodeIds] : [])
  }, [folderNodeIds, isExpandedAll])

  useEffect(() => {
    if (!currentFilePath) return

    setExpandedIds((prevIds) => {
      if (prevIds.includes(currentFilePath)) {
        return prevIds
      }

      const targetPaths = currentFilePath.split('/')
      const targetIds = targetPaths.map((_, index) =>
        targetPaths.slice(0, index + 1).join('/')
      )

      return targetIds.reduce(
        (result, id) => (result.includes(id) ? result : [...result, id]),
        prevIds
      )
    })
  }, [currentFilePath])

  const treeView = useMemo(() => {
    const onNodeToggle = (_, nodeIds) => {
      setExpandedIds(nodeIds)
    }

    return (
      <TreeView
        className={classes.root}
        expanded={expandedIds}
        onNodeToggle={onNodeToggle}
        {...getDefaultIcon(isLoading, theme)}
      >
        <Tree
          tree={objectTree}
          onItemClick={onItemClick}
          isLoading={isLoading}
        />
      </TreeView>
    )
  }, [objectTree, onItemClick, expandedIds, isLoading]) // eslint-disable-line

  return treeView
}
