import { DEFAULT_HEADER_HEIGHT } from 'constants'
import { getCommonScrollbarStyle } from 'utils/style'
import { styled as muiStyled } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import { useTheme } from '@material-ui/core'

export const DrawerHeader = ({ selected, height, ...props }) => {
  const theme = useTheme()

  const bgColor = theme.palette.type === 'dark' ? '#141a1e' : 'rgb(55, 62, 67)'

  return (
    <Box
      sx={{
        background: bgColor,
        minHeight: height || DEFAULT_HEADER_HEIGHT,
        boxSizing: 'border-box',
        color: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
      }}
      {...props}
    />
  )
}

export const DrawerFooter = muiStyled(Box)({
  width: '100%',
  height: 44,
  display: 'flex',
  alignItems: 'center',
})

export const DrawerContent = muiStyled(Paper)(({ theme }) => ({
  flex: 1,
  boxShadow: 'none',
  border: 'none',
  borderRadius: '0',
  padding: 0,
  overflow: 'hidden',

  // @FIXME The scrollbar with style will be a bit lag...
  '& > div > div': {
    ...getCommonScrollbarStyle(theme),
  },
}))
