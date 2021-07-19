import React from 'react'
import PropTypes from 'prop-types'
import SvgIcon from '@material-ui/core/SvgIcon'
import { alpha, makeStyles, withStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import Collapse from '@material-ui/core/Collapse'
import { useSpring, animated } from 'react-spring'
import { get, set, isEmpty, sortBy, compact } from 'lodash'
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFileText,
} from 'react-icons/ai'
import { FaPenSquare, FaPlusSquare, FaWindowClose } from 'react-icons/fa'

const MAIN_COLOR = '#384861'
const ADD_COLOR = '#2ba770'
const DELETE_COLOR = '#f03a47'
const MODIFY_COLOR = '#fc9b02'
function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  })

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  )
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
}

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
  content: {
    '&:hover': {
      backgroundColor: '#eff2f4',
    },
    padding: '5px 6px',
    borderRadius: '3px',
  },
  treeItemRoot: {
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `#d6e7fd`,
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label':
      {
        backgroundColor: 'transparent',
      },
  },
  label: {
    backgroundColor: 'transparent !important',
  },
})

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => {
  const classes = useStyles()

  return (
    <TreeItem
      {...props}
      classes={{
        root: classes.treeItemRoot,
        content: classes.content,
        label: classes.label,
      }}
      TransitionComponent={TransitionComponent}
    />
  )
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

  return objTree
}

const LabelIcon = ({ status }) => {
  switch (status) {
    case 'normal':
    case 'renamed':
    default:
      return <AiOutlineFileText color={MAIN_COLOR} />
    case 'modified':
      return <FaPenSquare color={MODIFY_COLOR} />
    case 'added':
      return <FaPlusSquare color={ADD_COLOR} />
    case 'removed':
      return <FaWindowClose color={DELETE_COLOR} />
  }
}

const renderTree = (tree, parentNodeId) => {
  if (isEmpty(tree)) return null

  return sortBy(Object.keys(tree), [
    (key) => {
      if (tree[key].children) return 0
      else return 1
    },
  ]).map((key) => {
    const node = tree[key]
    const hasChildren = !isEmpty(node.children)
    const status = node.status || 'normal'
    const nodeId = compact([parentNodeId, key]).join('/')

    if (hasChildren) {
      const hasOneChild = Object.keys(node.children).length === 1

      if (hasOneChild) {
        const childKey = Object.keys(node.children)[0]
        const child = node.children[childKey]
        const isChildLeaf = isEmpty(child.children)

        if (isChildLeaf) {
          return (
            <StyledTreeItem nodeId={nodeId} label={key}>
              {renderTree(node.children, nodeId)}
            </StyledTreeItem>
          )
        }
      }

      return (
        <StyledTreeItem nodeId={nodeId} label={key}>
          {renderTree(node.children, nodeId)}
        </StyledTreeItem>
      )
    }

    return (
      <StyledTreeItem
        nodeId={nodeId}
        label={key}
        icon={<LabelIcon status={status} />}
      />
    )
  })
}

export default function CustomizedTreeView({ tree, repo }) {
  const classes = useStyles()
  const objectTree = generateTree(tree)

  console.log(objectTree)
  return (
    <TreeView
      className={classes.root}
      defaultExpanded={[repo]}
      defaultCollapseIcon={<AiFillFolderOpen color={MAIN_COLOR} />}
      defaultExpandIcon={<AiFillFolder color={MAIN_COLOR} />}
      defaultEndIcon={<AiOutlineFileText color={MAIN_COLOR} />}
    >
      {renderTree(objectTree)}
    </TreeView>
  )
}
