import { DEFAULT_HEADER_HEIGHT } from 'constants'
import { getCommonScrollbarStyle } from 'utils/style'
import { styled as muiStyled } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'

export const DrawerHeader = ({ selected, height, ...props }) => {
  return (
    <Box
      sx={{
        background: 'rgb(55, 62, 67)',
        height: height || DEFAULT_HEADER_HEIGHT,
        boxSizing: 'border-box',
        color: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
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
  padding: '14px',
  flex: 1,
  overflow: 'auto',
  boxShadow: 'none',
  border: 'none',
  borderRadius: '0',

  ...getCommonScrollbarStyle(theme),
}))
