import GithubLink from 'components/shared/GithubLink'

import { styled as muiStyled, makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import tinycolor from 'tinycolor2'
import { getCommonScrollbarStyle } from 'utils/style'

const BUTTON_HEIGHT = 40

export const MenuContainer = muiStyled(Paper)(({ theme }) => ({
  border:
    theme.palette.type === 'dark'
      ? `1px solid ${theme.palette.text.secondary}`
      : 'none',
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

  ...getCommonScrollbarStyle(theme),
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
        ? theme.palette.background.default
        : theme.palette.background.paper,

    '&:hover': {
      backgroundColor: tinycolor
        .mix(theme.palette.text.primary, theme.palette.background.paper, 90)
        .toHexString(),
      textDecoration: 'none',
    },

    '&:first-child': {
      borderTop: 'none',
      fontSize: 16,
      padding: 14,
    },

    '& > div:nth-child(1)': {
      color: theme.palette.text.primary,
      fontSize: 16,
    },

    '& > div:nth-child(2)': {
      color: theme.palette.text.secondary,
      fontSize: 14,
    },
  },
}))

export const StyledGithubLink = ({ selected, height, ...props }) => {
  const classes = useStyledGithubLinkStyle({ selected, height })
  return <GithubLink className={classes.root} color="inherit" {...props} />
}

export const CommitDetail = muiStyled(Box)({
  marginTop: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',

  '& > div': {
    marginLeft: '8px',
  },
  '& > div:first-child': {
    marginLeft: '0',
  },
})

export const Sha = muiStyled(Box)({
  width: 54,
  textAlign: 'center',
})

export const IconBox = ({ size = 24, isIdle, ...props }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        cursor: 'pointer',
        marginLeft: 4,

        height: size,
        width: size,

        padding: 2,
        borderRadius: 4,
        transition: 'opacity 0.2s',

        '&:hover': {
          opacity: isIdle ? 0.7 : 'unset',
        },
        '&:active': {
          opacity: isIdle ? 0.5 : 'unset',
        },

        '& > *': {
          height: size - 4,
          width: size - 4,

          position: 'absolute',
          left: 2,
          right: 2,
        },
      }}
      {...props}
    />
  )
}

export const SmallAvatar = muiStyled(Avatar)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
}))

export const ToggleButton = muiStyled(Button)(({ theme }) => ({
  display: 'block',
  width: '100%',
  height: '40px',
  borderBottom:
    theme.palette.type === 'dark' ? '1px solid #666' : '1px solid #f1f1f1',
  borderRadius: '0',
  textTransform: 'none',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}))
