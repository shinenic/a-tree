import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

export const LoadingCircular = (props) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0002'
      }}
    >
      <CircularProgress size={20} {...props} />
    </Box>
  )
}
