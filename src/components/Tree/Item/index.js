import { MODIFIER_KEY_PROPERTY } from 'constants/base'
import { openInNewTab } from 'utils/chrome'
import useContextMenuStore from 'stores/contextMenu'
import useViewedFilesStore from 'stores/pull'
import { isEmpty } from 'lodash'
import useEllipsis from 'hooks/useEllipsis'
import { Tooltip } from '@material-ui/core'

import ListItem from '@material-ui/core/ListItem'
import useTreeStore from 'stores/tree'
import { useTooltipStyles } from 'components/shared/EllipsisBox'

import NodeIcon from './Icon'
import { useNodeStyle, BASE_PADDING, LEVEL_ADDITIONAL_PADDING } from './style'

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
  const tooltipClasses = useTooltipStyles()
  const [titleRef, isEllipsis] = useEllipsis()

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
   * @note Use native dom (e.g. div) instead of Mui's `Box` for better performance,
   *       also it's better to simply the dom structure to keep good performance.
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
      {isEllipsis ? (
        <Tooltip title={name} classes={tooltipClasses}>
          <div className={classes.itemText}>{name}</div>
        </Tooltip>
      ) : (
        <div className={classes.itemText} title={name} ref={titleRef}>
          {name}
        </div>
      )}
    </ListItem>
  )
}

export default TreeItem
