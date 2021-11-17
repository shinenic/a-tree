import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFileText,
} from 'react-icons/ai'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import tinycolor from 'tinycolor2'
import { MODIFIER_KEY_PROPERTY } from 'constants'
import { openInNewTab } from 'utils/chrome'
import useContextMenuStore from 'stores/contextMenu'
import useViewedFilesStore from 'stores/pull'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import useTreeStore from 'stores/tree'

import { MAIN_COLOR } from './constants'
import LabelIcon from './LabelIcon'

const HOVER_BG = '#eff2f4'
const SELECT_BG = '#d6e7fd'

const useNodeStyle = makeStyles((theme) => ({
  iconRoot: {
    minWidth: 'auto',
    marginRight: 10,
    marginLeft: 6,
    fontSize: 18,
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
}))

const NodeIcon = ({ isOpen, isLeaf, status }) => {
  const theme = useTheme()

  const color =
    theme.palette.type === 'dark'
      ? tinycolor(MAIN_COLOR).brighten(60).toHexString()
      : MAIN_COLOR

  if (status) return <LabelIcon status={status} />
  if (isLeaf) return <AiOutlineFileText color={color} />
  if (isOpen) return <AiFillFolderOpen color={color} />
  return <AiFillFolder color={color} />
}

const TreeItem = ({
  data: { isLeaf, name, nestingLevel, id, meta, onItemClick, getNodeHref },
  isOpen,
  style,
  setOpen,
}) => {
  const isViewed = useViewedFilesStore((s) => s.viewedFileMap[id])

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

  const handleClick = (e) => {
    e.stopPropagation()
    setSelectedId(id)

    if (isLeaf) {
      setOpen(!isOpen)
    }

    // Perform open link in new tab
    if (e[MODIFIER_KEY_PROPERTY]) {
      openInNewTab(getNodeHref(meta))
      return
    }

    if (onItemClick) onItemClick(meta, e)
  }

  return (
    <ListItem
      disableGutters
      button
      selected={isSelected}
      style={{
        ...style,
        marginLeft: nestingLevel * 20 + 10,
        transition: 'opacity 0.4s',
        ...(isViewed && { opacity: 0.5 }),
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      classes={{ root: classes.itemRoot, selected: classes.itemSelected }}
    >
      <ListItemIcon classes={{ root: classes.iconRoot }}>
        <NodeIcon isOpen={isOpen} isLeaf={isLeaf} status={meta?.status} />
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  )
}
export default TreeItem
