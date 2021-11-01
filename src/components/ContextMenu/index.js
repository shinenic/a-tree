import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import useContextMenu from 'stores/contextMenu'
import useGetNodeHref from 'hooks/tree/useGetNodeHref'
import { makeStyles } from '@material-ui/core/styles'
import useClickOutside from 'hooks/useClickOutside'
import useQueryTree from 'hooks/tree/useQueryTree'
import { last, omit } from 'lodash'
import { PULL_PAGE_TYPE } from 'constants'
import useUpdateEffect from 'hooks/useUpdateEffect'
import { download, copyToClipboard } from 'utils'
import { getFileNodes } from 'utils/pullPage'
import { openInNewTab } from 'utils/chrome'

import {
  MdOpenInNew,
  MdOutlineRemoveCircleOutline,
  MdOutlineCheckCircleOutline,
} from 'react-icons/md'
import { FiDownload } from 'react-icons/fi'
import { GrCopy } from 'react-icons/gr'
import { FaRegCopy } from 'react-icons/fa'
import { BsArrowsExpand, BsArrowsCollapse } from 'react-icons/bs'
import { LoadingCircular } from './style'

const useStyles = makeStyles({
  root: {
    pointerEvents: 'none', // To enable click outside
  },
  paper: {
    pointerEvents: 'auto',
  },
  staticMenuItem: {
    '&:hover': {
      backgroundColor: 'unset',
    },
    userSelect: 'auto',
    cursor: 'auto',
  },
  menuItemGutters: {
    marginLeft: 8,
    marginRight: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  menuList: {
    padding: '4px 0',
  },
})

const getRawContent = async (node) => {
  // node from pull or commit tree
  if (node?.raw_url) {
    const response = await fetch(node.raw_url)
    const result = await response.text()

    return result
  }

  const nodeContentUrl = node?.url || node?.contents_url
  const response = await fetch(nodeContentUrl)
  const result = await response.json()

  return window.atob(result.content.replace('\n', ''))
}

const checkIsFileNode = (node) => {
  if (!node) return false

  return node?.type === 'blob' || Boolean(node?.status)
}

export default function ContextMenu({ ...pageInfo }) {
  const { files } = useQueryTree(pageInfo, false)
  const classes = useStyles()
  const [loading, setLoading] = useState(false)

  const { pageType } = pageInfo
  const { isContextMenuOpened, clickedTreeNode, position, closeContextMenu } =
    useContextMenu()
  const getNodeHref = useGetNodeHref(pageInfo)

  const modalRef = useClickOutside(closeContextMenu)
  const href = clickedTreeNode ? getNodeHref(clickedTreeNode) : null

  useEffect(() => {
    if (isContextMenuOpened) {
      setLoading(false)
    }
  }, [isContextMenuOpened])

  useUpdateEffect(() => {
    closeContextMenu()
  }, [pageType])

  const isFileNode = checkIsFileNode(clickedTreeNode)

  const items = [
    {
      text: clickedTreeNode?.nodeId,
      insertDivider: true,
      disableRipple: true,
      classes: { root: classes.staticMenuItem },
      enabled: clickedTreeNode,
    },
    {
      text: 'Open Link in New Tab',
      onClick: () => {
        closeContextMenu()
        setTimeout(() => {
          openInNewTab(href)
        }, 150)
      },
      icon: MdOpenInNew,
      enabled: clickedTreeNode,
    },
    {
      text: 'Download File',
      onClick: async () => {
        setLoading(true)
        const text = await getRawContent(clickedTreeNode)
        const fileName = last(clickedTreeNode.nodeId.split('/'))
        closeContextMenu()

        setTimeout(() => {
          download(fileName, text)
        }, 150)
      },
      icon: FiDownload,
      enabled: isFileNode,
      insertDivider: true,
    },
    {
      text: 'Copy Path',
      onClick: async () => {
        await copyToClipboard(clickedTreeNode.nodeId)
        closeContextMenu()
      },
      icon: FaRegCopy,
      enabled: clickedTreeNode,
    },
    {
      text: 'Copy Full File Content',
      onClick: async () => {
        setLoading(true)
        const text = await getRawContent(clickedTreeNode)
        await copyToClipboard(text)
        setLoading(false)
        setTimeout(() => {
          closeContextMenu()
        }, 300)
      },
      icon: GrCopy,
      enabled: isFileNode,
      insertDivider: true,
    },
    {
      text: 'Mark All Files as viewed',
      onClick: () => {
        const currentVisibleFileNodes = getFileNodes()
        const isAllNodeLoaded =
          files?.length ?? currentVisibleFileNodes.length === 0

        if (isAllNodeLoaded) {
          document
            .querySelectorAll('.js-reviewed-checkbox')
            .forEach((input) => input.checked || input.click())
        }
        closeContextMenu()
      },
      icon: MdOutlineCheckCircleOutline,
      enabled: PULL_PAGE_TYPE.PULL_FILES === pageType,
    },
    {
      text: 'Mark All Files as not viewed',
      onClick: () => {
        const currentVisibleFileNodes = getFileNodes()
        const isAllNodeLoaded =
          files?.length ?? currentVisibleFileNodes.length === 0

        if (isAllNodeLoaded) {
          document
            .querySelectorAll('.js-reviewed-checkbox')
            .forEach((input) => !input.checked || input.click())
        }
        closeContextMenu()
      },
      icon: MdOutlineRemoveCircleOutline,
      enabled: PULL_PAGE_TYPE.PULL_FILES === pageType,
      insertDivider: true,
    },
    {
      text: 'Expand all viewed files', // Not implemented
      onClick: closeContextMenu,
      icon: BsArrowsExpand,
      enabled: PULL_PAGE_TYPE.PULL_FILES === pageType,
    },
    {
      text: 'Collapse all viewed files', // Not implemented
      onClick: closeContextMenu,
      icon: BsArrowsCollapse,
      enabled: PULL_PAGE_TYPE.PULL_FILES === pageType,
    },
  ]

  const enabledItems = items
    .filter(({ enabled }) => enabled)
    .map((item) => omit(item, ['enabled']))

  if (enabledItems.length === 0) return null

  return createPortal(
    <Menu
      keepMounted
      disableScrollLock
      open={isContextMenuOpened}
      onContextMenu={(e) => e.preventDefault()}
      onClose={closeContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={
        isContextMenuOpened
          ? { top: position.mouseY, left: position.mouseX }
          : undefined
      }
      PopoverClasses={{
        root: classes.root,
        paper: classes.paper,
      }}
      MenuListProps={{ ref: modalRef, classes: { root: classes.menuList } }}
    >
      {loading && <LoadingCircular />}
      {enabledItems.map(
        (
          {
            text,
            onClick,
            icon: Icon,
            insertDivider,
            classes: customClasses,
            ...rest
          },
          index
        ) => {
          const isLast = index === enabledItems.length - 1

          return (
            <MenuItem
              key={text}
              onClick={onClick}
              divider={insertDivider && !isLast}
              classes={{ gutters: classes.menuItemGutters, ...customClasses }}
              {...rest}
            >
              {Icon && <Icon style={{ marginRight: 8 }} />} {text}
            </MenuItem>
          )
        }
      )}
    </Menu>,
    document.querySelector('body')
  )
}
