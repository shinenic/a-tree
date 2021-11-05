import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import useContextMenu from 'stores/contextMenu'
import useGetNodeHref from 'hooks/tree/useGetNodeHref'
import useClickOutside from 'hooks/useClickOutside'
import useQueryTree from 'hooks/tree/useQueryTree'
import { last, omit } from 'lodash'
import { PULL_PAGE_TYPE, CONTEXT_ITEM } from 'constants'
import useUpdateEffect from 'hooks/useUpdateEffect'
import { download, copyToClipboard } from 'utils'
import {
  getFileNodes,
  markAllFiles,
  checkFileNodeExisting,
  getFileHashId,
  toggleViewedFilesFolding,
} from 'utils/pullPage'
import { openInNewTab } from 'utils/chrome'
import { getRawContent, checkIsFileNode } from 'utils/tree'
import useStore from 'stores/setting'
import useArray from 'hooks/useArray'

import {
  useStyles,
  CONTEXT_ICON_MAP,
  ItemLoadingCircular,
  ListWrapper,
} from './style'

export default function ContextMenu({ ...pageInfo }) {
  const token = useStore((s) => s.token)
  const drawerPinned = useStore((s) => s.drawerPinned)
  const { files } = useQueryTree(pageInfo, drawerPinned)
  const classes = useStyles()
  const [loadingItems, addItemLoading, removeItemLoaded, _, clearLoadingItems] =
    useArray([])

  const { pageType } = pageInfo
  const { isContextMenuOpened, clickedTreeNode, position, closeContextMenu } =
    useContextMenu()
  const getNodeHref = useGetNodeHref(pageInfo)

  const modalRef = useClickOutside(closeContextMenu)
  const href = clickedTreeNode ? getNodeHref(clickedTreeNode) : null
  console.log({ isContextMenuOpened, clickedTreeNode, position })

  useEffect(() => {
    if (!isContextMenuOpened) {
      clearLoadingItems()
    }
  }, [clearLoadingItems, isContextMenuOpened])

  useUpdateEffect(() => {
    closeContextMenu()
  }, [pageType])

  const handleMarkingAllFiles = async (isViewed = true, itemKey) => {
    addItemLoading(itemKey)

    const currentVisibleFileNodes = getFileNodes()
    const isAllNodeLoaded = files?.length === currentVisibleFileNodes.length

    /**
     * Toggle lazy load to ensure all files loaded
     */
    if (!isAllNodeLoaded) {
      const lastFileHash = getFileHashId(last(files).filename)

      await new Promise((resolve) => {
        window.location.hash = lastFileHash
        setTimeout(resolve, 100)
      })
      await checkFileNodeExisting(lastFileHash, 1000 * 10)
    }

    await markAllFiles(isViewed)
    removeItemLoaded(itemKey)
    closeContextMenu()
  }

  const handleViewedFilesFolding = async (shouldCollapse = true, itemKey) => {
    addItemLoading(itemKey)

    const currentVisibleFileNodes = getFileNodes()
    const isAllNodeLoaded = files?.length === currentVisibleFileNodes.length

    /**
     * Toggle lazy load to ensure all files loaded
     */
    if (!isAllNodeLoaded) {
      const lastFileHash = getFileHashId(last(files).filename)

      await new Promise((resolve) => {
        window.location.hash = lastFileHash
        setTimeout(resolve, 100)
      })
      await checkFileNodeExisting(lastFileHash, 1000 * 10)
    }

    await toggleViewedFilesFolding(shouldCollapse)
    removeItemLoaded(itemKey)
    closeContextMenu()
  }

  const isFileNode = checkIsFileNode(clickedTreeNode)

  /**
   * @TODO Handle `no-token` warning via a toast
   */
  const items = [
    {
      key: CONTEXT_ITEM.PATHNAME,
      text: clickedTreeNode?.nodeId,
      insertDivider: true,
      disableRipple: true,
      classes: { root: classes.staticMenuItem },
      isVisible: clickedTreeNode,
    },
    {
      key: CONTEXT_ITEM.OPEN_LINK_IN_NEW_TAB,
      text: 'Open Link in New Tab',
      onClick: () => {
        closeContextMenu()
        setTimeout(() => {
          openInNewTab(href)
        }, 150)
      },
      isVisible: clickedTreeNode,
    },
    {
      key: CONTEXT_ITEM.DOWNLOAD_FILE,
      text: token ? 'Download File' : 'Download File (Token Required)',
      onClick: async () => {
        addItemLoading(CONTEXT_ITEM.DOWNLOAD_FILE)
        try {
          const text = await getRawContent(clickedTreeNode, token)
          const fileName = last(clickedTreeNode.nodeId.split('/'))
          closeContextMenu()

          setTimeout(() => {
            download(fileName, text)
          }, 150)
        } finally {
          closeContextMenu()
          removeItemLoaded(CONTEXT_ITEM.DOWNLOAD_FILE)
        }
      },
      disabled: !token,
      isVisible: isFileNode,
      insertDivider: true,
    },
    {
      key: CONTEXT_ITEM.COPY_PATHNAME,
      text: 'Copy Path',
      onClick: async () => {
        await copyToClipboard(clickedTreeNode.nodeId)
        closeContextMenu()
      },
      isVisible: clickedTreeNode,
    },
    {
      key: CONTEXT_ITEM.COPY_FILE_CONTENT,
      text: token
        ? 'Copy Full File Content'
        : 'Copy Full File Content (Token Required)',
      onClick: async () => {
        addItemLoading(CONTEXT_ITEM.COPY_FILE_CONTENT)
        try {
          const text = await getRawContent(clickedTreeNode, token)
          await copyToClipboard(text)
          setTimeout(() => {
            closeContextMenu()
          }, 300)
        } finally {
          closeContextMenu()
          removeItemLoaded(CONTEXT_ITEM.COPY_FILE_CONTENT)
        }
      },
      disabled: !token,
      isVisible: isFileNode,
      insertDivider: true,
    },
    {
      key: CONTEXT_ITEM.MARK_ALL_FILES_AS_VIEWED,
      text: 'Mark All Files as viewed',
      onClick: () => {
        handleMarkingAllFiles(true, CONTEXT_ITEM.MARK_ALL_FILES_AS_VIEWED)
      },
      isVisible: PULL_PAGE_TYPE.PULL_FILES === pageType,
    },
    {
      key: CONTEXT_ITEM.MARK_ALL_FILES_AS_NOT_VIEWED,
      text: 'Mark All Files as not viewed',
      onClick: () => {
        handleMarkingAllFiles(false, CONTEXT_ITEM.MARK_ALL_FILES_AS_NOT_VIEWED)
      },
      isVisible: PULL_PAGE_TYPE.PULL_FILES === pageType,
      insertDivider: true,
    },
    {
      key: CONTEXT_ITEM.EXPAND_ALL_VIEWED_FILES,
      text: 'Expand all viewed files',
      onClick: () => {
        handleViewedFilesFolding(false, CONTEXT_ITEM.EXPAND_ALL_VIEWED_FILES)
      },
      isVisible: PULL_PAGE_TYPE.PULL_FILES === pageType,
    },
    {
      key: CONTEXT_ITEM.COLLAPSE_ALL_VIEWED_FILES,
      text: 'Collapse all viewed files',
      onClick: () => {
        handleViewedFilesFolding(true, CONTEXT_ITEM.COLLAPSE_ALL_VIEWED_FILES)
      },
      isVisible: PULL_PAGE_TYPE.PULL_FILES === pageType,
    },
  ]

  const visibleItems = items
    .filter(({ isVisible }) => isVisible)
    .map((item) => omit(item, ['isVisible']))

  if (visibleItems.length === 0) return null

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
      {visibleItems.map(
        (
          {
            key,
            text,
            onClick,
            insertDivider,
            classes: customClasses,
            disabled,
            ...rest
          },
          index
        ) => {
          const isLast = index === visibleItems.length - 1
          const Icon = CONTEXT_ICON_MAP[key]
          const isLoading = loadingItems.includes(key)

          return (
            <MenuItem
              key={key}
              onClick={onClick}
              divider={insertDivider && !isLast}
              disabled={disabled || isLoading}
              selected={isLoading}
              classes={{ gutters: classes.menuItemGutters, ...customClasses }}
              {...rest}
            >
              <ListWrapper>
                {Icon && <Icon style={{ marginRight: 8 }} />} {text}
                {isLoading && <ItemLoadingCircular />}
              </ListWrapper>
            </MenuItem>
          )
        }
      )}
    </Menu>,
    document.querySelector('body')
  )
}
