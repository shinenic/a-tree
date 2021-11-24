import { styled as muiStyled, makeStyles } from '@material-ui/core/styles'

export const TitleBox = muiStyled('div')(({ theme }) => ({
  borderTop: 'none',
  fontSize: 16,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}))

const useIconStyle = makeStyles({
  root: {
    position: 'relative',
    cursor: 'pointer',
    marginLeft: 4,

    height: ({ size }) => size,
    width: ({ size }) => size,

    padding: 2,
    borderRadius: 4,
    transition: 'opacity 0.2s',

    '&:hover': {
      opacity: ({ isIdle }) => (isIdle ? 0.7 : 'unset'),
    },
    '&:active': {
      opacity: ({ isIdle }) => (isIdle ? 0.5 : 'unset'),
    },

    '& > *': {
      height: ({ size }) => size - 4,
      width: ({ size }) => size - 4,

      position: 'absolute',
      left: 2,
      right: 2,
    },
  },
})

export const IconBox = ({ size = 24, isIdle, ...props }) => {
  const classes = useIconStyle({ size, isIdle })
  return <div className={classes.root} {...props} />
}

export const Sha = muiStyled('div')({
  width: 54,
  textAlign: 'center',
})

export const CommitDetail = muiStyled('div')(({ theme }) => ({
  marginTop: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  color: theme.palette.text.secondary,
  fontSize: 14,

  '& > div:not(:first-of-type)': {
    marginLeft: 8,
  },
}))
