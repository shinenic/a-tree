import GithubLink from 'components/shared/GithubLink'

import { styled as muiStyled, makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import tinycolor from 'tinycolor2'
import { getCommonScrollbarStyle } from 'utils/style'

const BUTTON_HEIGHT = 40

export const useVizListContainerStyle = makeStyles((theme) => ({
  root: {
    border: theme.palette.type === 'dark' ? `1px solid ${theme.palette.text.secondary}` : 'none',
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
    position: 'fixed',
    boxShadow: theme.shadows[3],

    '& > div': {
      ...getCommonScrollbarStyle(theme)
    }
  }
}))

export const MenuContainer = muiStyled(Box)(({ theme }) => ({
  border: theme.palette.type === 'dark' ? `1px solid ${theme.palette.text.secondary}` : 'none',
  backgroundColor: theme.palette.background.paper,
  top: `${BUTTON_HEIGHT + 10}px`,
  zIndex: 10,
  position: 'fixed',
  maxWidth: '540px',
  minWidth: '440px',
  maxHeight: '50vh',
  overflowX: 'hidden',
  overflowY: 'auto',

  boxShadow: theme.shadows[3],

  ...getCommonScrollbarStyle(theme)
}))

const useStyledGithubLinkStyle = makeStyles((theme) => ({
  root: {
    padding: '8px 14px',

    display: 'block',
    color: theme.palette.text.primary,
    borderTop: `1px solid ${
      theme.palette.type === 'dark' ? theme.palette.text.secondary : '#e1e4e8'
    }`,
    transition: 'background 0.1s',

    backgroundColor: ({ selected }) =>
      selected
        ? tinycolor
            .mix(theme.palette.text.primary, theme.palette.background.paper, 86)
            .toHexString()
        : theme.palette.background.paper,

    '&:hover': {
      backgroundColor: ({ selected }) =>
        tinycolor
          .mix(theme.palette.text.primary, theme.palette.background.paper, selected ? 86 : 93)
          .toHexString(),
      textDecoration: 'none'
    },

    '&:first-child': {
      borderTop: 'none',
      fontSize: 16,
      padding: 14
    }
  }
}))

export const StyledGithubLink = ({ selected, ...props }) => {
  const classes = useStyledGithubLinkStyle({ selected })
  return <GithubLink className={classes.root} {...props} />
}

export const SmallAvatar = muiStyled(Avatar)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3)
}))

const useButtonStyle = makeStyles((theme) => ({
  root: {
    display: 'block',
    width: '100%',
    height: '40px',
    borderBottom: theme.palette.type === 'dark' ? '1px solid #666' : '1px solid #f1f1f1',
    borderRadius: '0',
    textTransform: 'none'
  },
  label: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
}))

export const ToggleButton = (props) => {
  const classes = useButtonStyle()
  return <Button classes={classes} {...props} />
}
