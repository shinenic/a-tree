import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFileText,
} from 'react-icons/ai'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import tinycolor from 'tinycolor2'
import { MODIFIER_KEY_PROPERTY, FILE_ICON_STYLE } from 'constants'
import { openInNewTab } from 'utils/chrome'
import useContextMenuStore from 'stores/contextMenu'
import useViewedFilesStore from 'stores/pull'
import { isEmpty } from 'lodash'
import CircularProgress from '@material-ui/core/CircularProgress'
import useSettingStore from 'stores/setting'

import ListItem from '@material-ui/core/ListItem'
import useTreeStore from 'stores/tree'
import {
  getClassWithColor as getFileIconClassesWithColor,
  getClass as getFileIconClasses,
} from 'file-icons-js'

import {
  LabelTextSkeleton,
  IconSkeleton,
} from 'components/MainDrawer/Tabs/Loading/placeholder'

import { MAIN_COLOR } from './constants'
import DiffLabelIcon from './DiffLabelIcon'

const HOVER_BG = '#eff2f4'
const SELECT_BG = '#d6e7fd'

const BASE_PADDING = 10
const LEVEL_ADDITIONAL_PADDING = 20

const useNodeStyle = makeStyles((theme) => ({
  iconRoot: {
    minWidth: 'auto',
    boxSizing: 'border-box',
    width: 34,
    paddingRight: 10,
    paddingLeft: 6,
    fontSize: 18,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > i': {
      transform: 'translateX(1px)'
    },
    '& > i:before': {
      fontSize: 16,
    },
  },
  itemRoot: {
    userSelect: 'none',
    wordBreak: 'break-word',
    borderRadius: 3,
    '&:hover': {
      backgroundColor:
        theme.palette.type === 'light'
          ? HOVER_BG
          : tinycolor
              .mix(HOVER_BG, theme.palette.background.paper, 80)
              .toHexString(),
    },
  },
  itemSelected: {
    backgroundColor:
      theme.palette.type === 'light'
        ? SELECT_BG
        : tinycolor
            .mix(SELECT_BG, theme.palette.background.paper, 80)
            .toHexString(),
  },
  itemContent: {
    maxWidth: '100%',
    fontSize: '16px',
  },
  itemText: {
    fontSize: '16px',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}))

const NodeIcon = ({ isOpen, isLeaf, status, isLoading, name }) => {
  const theme = useTheme()
  const fileIconStyle = useSettingStore((s) => s.fileIconStyle)

  const color =
    theme.palette.type === 'dark'
      ? tinycolor(MAIN_COLOR).brighten(60).toHexString()
      : MAIN_COLOR

  if (isLoading) return <CircularProgress size={18} />
  if (status) return <DiffLabelIcon status={status} />
  if (!isLeaf) {
    return isOpen ? (
      <AiFillFolderOpen color={color} />
    ) : (
      <AiFillFolder color={color} />
    )
  }

  if (
    fileIconStyle === FILE_ICON_STYLE.COLORFUL &&
    getFileIconClassesWithColor(name)
  ) {
    return (
      <i
        className={getFileIconClassesWithColor(name)}
        style={{ fontStyle: 'normal' }}
      />
    )
  }

  if (fileIconStyle === FILE_ICON_STYLE.VARIANT && getFileIconClasses(name)) {
    return (
      <i className={getFileIconClasses(name)} style={{ fontStyle: 'normal' }} />
    )
  }

  return <AiOutlineFileText color={color} />
}

const TreeItem = ({
  data: {
    isLeaf,
    name,
    nestingLevel,
    id,
    meta,
    onItemClick,
    getNodeHref,
    queryBySha,
  },
  isOpen,
  style,
  setOpen,
}) => {
  const isViewed = useViewedFilesStore((s) => s.viewedFileMap[id])

  const isLoading = !isLeaf && isOpen && isEmpty(meta.children)
  const isSelected = useTreeStore((s) => s.selectedId === id)
  const setSelectedId = useTreeStore((s) => s.setSelectedId)

  const classes = useNodeStyle()

  const openContextMenu = useContextMenuStore((s) => s.openContextMenu)

  const handleContextMenu = (e) => {
    setSelectedId(id)

    if (!meta) return

    e.preventDefault()
    e.stopPropagation()

    openContextMenu(e, meta)
  }

  const handleClick = async (e) => {
    e.stopPropagation()
    setSelectedId(id)

    if (!isLeaf) {
      setOpen(!isOpen)

      if (!isLoading && queryBySha) {
        queryBySha(meta.sha)
      }
    }

    // Perform open link in new tab
    if (e[MODIFIER_KEY_PROPERTY]) {
      openInNewTab(getNodeHref(meta))
      return
    }

    if (onItemClick) onItemClick(meta, e)
  }

  const mouseDownHandler = (e) => {
    if (e.button === 1) {
      openInNewTab(getNodeHref(meta))
      e.preventDefault()
    }
  }

  /**
   * @note Prefer native dom (e.g. div) to Mui's `Box` for better performance.
   */
  return (
    <ListItem
      disableGutters
      button
      selected={isSelected}
      style={{
        ...style,
        marginLeft: nestingLevel * LEVEL_ADDITIONAL_PADDING + BASE_PADDING,
        transition: 'opacity 0.4s',
        width: `calc(100% - ${
          nestingLevel * LEVEL_ADDITIONAL_PADDING + BASE_PADDING * 2
        }px)`,
        opacity: isViewed ? 0.5 : 1,
      }}
      onClick={handleClick}
      onMouseDown={mouseDownHandler}
      onContextMenu={handleContextMenu}
      classes={{ root: classes.itemRoot, selected: classes.itemSelected }}
    >
      <div className={classes.iconRoot}>
        <NodeIcon
          isOpen={isOpen}
          isLeaf={isLeaf}
          status={meta?.status}
          isLoading={isLoading}
          name={name}
        />
      </div>
      <div className={classes.itemText} title={name}>
        {name}
      </div>
    </ListItem>
  )
}

export const TreeItemPlaceholder = ({ data: { nestingLevel }, style }) => {
  const classes = useNodeStyle()

  return (
    <ListItem
      disableGutters
      button
      disabled
      style={{
        ...style,
        marginLeft: nestingLevel * LEVEL_ADDITIONAL_PADDING + BASE_PADDING,
        transition: 'opacity 0.4s',
        width: `calc(100% - ${
          nestingLevel * LEVEL_ADDITIONAL_PADDING + BASE_PADDING * 2
        }px)`,
        opacity: 1,
      }}
    >
      <div className={classes.iconRoot}>
        <IconSkeleton />
      </div>
      <LabelTextSkeleton />
    </ListItem>
  )
}

export default TreeItem
