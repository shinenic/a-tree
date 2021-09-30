import { styled as muiStyled } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'

export const ErrorContainer = muiStyled(Paper)({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
})

export const HintContent = muiStyled(Box)(({ theme }) => ({
  transition: 'color 0.3s',
  marginTop: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.text.primary,
  },
}))
