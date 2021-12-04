import { makeStyles } from '@material-ui/core/styles'
import tinycolor from 'tinycolor2'

const HOVER_BG = '#eff2f4'
const SELECT_BG = '#d6e7fd'

export const BASE_PADDING = 10
export const LEVEL_ADDITIONAL_PADDING = 20

export const useNodeStyle = makeStyles((theme) => ({
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
