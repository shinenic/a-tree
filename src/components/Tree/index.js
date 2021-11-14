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
import { MODIFIER_KEY_PROPERTY } from 'constants'
import { openInNewTab } from 'utils/chrome'
import useContextMenuStore from 'stores/contextMenu'
import EllipsisBox from 'components/shared/EllipsisBox'
import TreeItem from './Item'
import { MAIN_COLOR } from './constants'
import LabelIcon from './LabelIcon'

const isTreeContent = (e) => {
  return [
    '[class*="MuiTreeItem-content"]',
    '[class*="MuiTreeItem-label"]',
    '[class*="MuiBox-root"]',
    'path',
  ].some((selector) => e.target.matches(selector))
}

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
})

const getDefaultIcon = (isDarkTheme) => {
  const getIconColor = (color) => {
    return isDarkTheme ? tinycolor(color).brighten(60).toHexString() : color
  }

  return {
    defaultCollapseIcon: <AiFillFolderOpen color={getIconColor(MAIN_COLOR)} />,
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

const Tree = ({
  tree,
  onItemClick,
  isLoading,
  handleNodeClick,
  getNodeHref,
}) => {
  const openContextMenu = useContextMenuStore((s) => s.openContextMenu)

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

    /**
     * Tree view has no official api to set `onContextMenu` for `tree item content` directly,
     * so in order to limit the clickable area,
     * detect only tree item content or it will won't stop propagation
     */
    const handleContextMenu = (e) => {
      if (!isTreeContent(e)) return

      e.preventDefault()
      e.stopPropagation()

      if (isLoading) return
      openContextMenu(e, node)
    }

    const Text = () => {
      return <EllipsisBox maxWidth="100%" text={label} withTooltip />
    }

    if (hasChildren) {
      return (
        <div key={node.nodeId}>
          <TreeItem
            nodeId={node.nodeId}
            onContextMenu={handleContextMenu}
            label={isLoading ? <LabelTextSkeleton /> : <Text />}
            onIconClick={handleNodeClick}
            onLabelClick={handleNodeClick}
          >
            <Tree
              tree={node.children}
              onItemClick={onItemClick}
              isLoading={isLoading}
              getNodeHref={getNodeHref}
            />
          </TreeItem>
        </div>
      )
    }

    const handleClick = (e) => {
      e.stopPropagation()

      if (e[MODIFIER_KEY_PROPERTY]) {
        openInNewTab(getNodeHref(node))
        return
      }

      if (onItemClick) onItemClick(node, e)
    }

    return (
      <div key={node.nodeId} onClick={handleClick}>
        <TreeItem
          onContextMenu={handleContextMenu}
          nodeId={node.nodeId}
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
  getNodeHref,
}) {
  const clickedTreeNode = useContextMenuStore((s) => s.clickedTreeNode)
  const [selectedId, setSelectedId] = useState(null)
  const [expandedIds, setExpandedIds] = useState([])
  const theme = useTheme()
  const isDarkTheme = theme.palette.type === 'dark'
  const classes = useStyles()

  const [objectTree, folderNodeIds] = useMemo(() => generateTree(tree), [tree])

  useEffect(() => {
    if (clickedTreeNode && clickedTreeNode.nodeId) {
      setSelectedId(clickedTreeNode.nodeId)
    }
  }, [clickedTreeNode])

  useEffect(() => {
    setExpandedIds(isExpandedAll ? [...folderNodeIds] : [])
  }, [folderNodeIds, isExpandedAll])

  useEffect(() => {
    if (isExpandedAll) return

    if (!currentFilePath) {
      setExpandedIds([])
      return
    }

    setExpandedIds((prevIds) => {
      const targetPaths = currentFilePath.split('/')
      const targetIds = targetPaths.map((_, index) =>
        targetPaths.slice(0, index + 1).join('/')
      )

      return (
        targetIds
          // Add the nodes which are necessary to reach to the currentFilePath
          .reduce(
            (result, id) => (result.includes(id) ? result : [...result, id]),
            prevIds
          )
          // Remove the deeper nodes beyond the currentFilePath
          .filter((id) => id.indexOf(`${currentFilePath}/`) !== 0)
      )
    })
  }, [currentFilePath, isExpandedAll])

  const loadingTreeView = useMemo(() => {
    const onNodeToggle = (e) => e.stopPropagation()

    return (
      <TreeView
        className={classes.root}
        defaultExpanded={expandedIds ? folderNodeIds : []}
        selected={null}
        onNodeToggle={onNodeToggle}
        defaultCollapseIcon={<IconSkeleton />}
        defaultExpandIcon={<IconSkeleton />}
        defaultEndIcon={<IconSkeleton />}
      >
        <Tree tree={objectTree} isLoading />
      </TreeView>
    )
  }, [objectTree, folderNodeIds]) // eslint-disable-line react-hooks/exhaustive-deps

  const treeView = useMemo(() => {
    const onNodeToggle = (_, nodeIds) => setExpandedIds(nodeIds)
    const onNodeSelect = (_, value) => setSelectedId(value)

    return (
      <TreeView
        className={classes.root}
        expanded={expandedIds}
        selected={selectedId}
        onNodeToggle={onNodeToggle}
        onNodeSelect={onNodeSelect}
        {...getDefaultIcon(isDarkTheme)}
      >
        <Tree
          tree={objectTree}
          onItemClick={onItemClick}
          getNodeHref={getNodeHref}
        />
      </TreeView>
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectTree, onItemClick, expandedIds, selectedId, isDarkTheme])

  /**
   * intentionally render two trees to reset the `defaultExpanded` state
   * when finish / start loading
   */
  return isLoading ? loadingTreeView : treeView
}
