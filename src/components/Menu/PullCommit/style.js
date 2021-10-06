import { styled as muiStyled } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

export const TitleBox = muiStyled(Box)(({ theme }) => ({
  borderTop: 'none',
  fontSize: 16,
  color: theme.palette.text.primary,
}))

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

export const Sha = muiStyled(Box)({
  width: 54,
  textAlign: 'center',
})

export const CommitDetail = muiStyled(Box)(({ theme }) => ({
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
