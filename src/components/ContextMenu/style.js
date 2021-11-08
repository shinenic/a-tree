import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

import {
  MdOpenInNew,
  MdOutlineRemoveCircleOutline,
  MdOutlineCheckCircleOutline,
} from 'react-icons/md'
import { FiDownload } from 'react-icons/fi'
import { BsArrowsExpand, BsArrowsCollapse } from 'react-icons/bs'
import { BiCopy, BiCopyAlt } from 'react-icons/bi'

import { CONTEXT_ITEM } from 'constants'

export const useStyles = makeStyles({
  root: {
    pointerEvents: 'none', // To enable click outside
  },
  paper: {
    pointerEvents: 'auto',
  },
  staticMenuItem: {
    backgroundColor: 'unset',
    '&:hover': {
      backgroundColor: 'unset',
    },
    userSelect: 'auto',
    cursor: 'auto',
    '& > div': {
      maxWidth: 300,
      wordBreak: 'break-word',
      whiteSpace: 'normal',
    },
  },
  menuItemGutters: {
    marginLeft: 8,
    marginRight: 8,
    paddingLeft: 8,
    paddingRight: 30,
  },
  menuList: {
    padding: '4px 0',
  },
})

export const CONTEXT_ICON_MAP = {
  [CONTEXT_ITEM.OPEN_LINK_IN_NEW_TAB]: MdOpenInNew,
  [CONTEXT_ITEM.DOWNLOAD_FILE]: FiDownload,
  [CONTEXT_ITEM.COPY_PATHNAME]: BiCopy,
  [CONTEXT_ITEM.COPY_FILE_CONTENT]: BiCopyAlt,
  [CONTEXT_ITEM.MARK_ALL_FILES_AS_VIEWED]: MdOutlineCheckCircleOutline,
  [CONTEXT_ITEM.MARK_ALL_FILES_AS_NOT_VIEWED]: MdOutlineRemoveCircleOutline,
  [CONTEXT_ITEM.EXPAND_ALL_VIEWED_FILES]: BsArrowsExpand,
  [CONTEXT_ITEM.COLLAPSE_ALL_VIEWED_FILES]: BsArrowsCollapse,
}

export const ListWrapper = (props) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...props}
    />
  )
}

export const ItemLoadingCircular = ({ size = 20, ...props }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        right: -size - 10,
        top: 0,
        height: size,
        width: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={size} {...props} />
    </Box>
  )
}
