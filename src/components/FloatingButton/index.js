import Box from '@material-ui/core/Box'
import useSettingStore from 'stores/setting'
import { makeStyles } from '@material-ui/core/styles'
import { getURL } from 'utils/chrome'
import useGetFloatingButtonProps from 'hooks/useGetFloatingButtonProps'

const BOX_SIZE = 40
const IMG_WIDTH = 30

const iconUrl = getURL('icon192.png')

const useStyles = ({ drawerPinned }) =>
  makeStyles((theme) => ({
    root: {
      width: BOX_SIZE,
      height: BOX_SIZE,
      backgroundColor: '#252a2e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: theme.shadows[2],
      borderLeft: 'none',
      borderRadius: '0 5px 5px 0',
      cursor: 'pointer',
      opacity: drawerPinned ? 0.8 : 1,
      transition: 'opacity 0.1s',

      '&:hover': {
        opacity: drawerPinned ? 0.7 : 0.9,
      },
    },
  }))

/**
 * @TODO Check do we need to hide the floating button and drawer at the same time?
 *       Or close drawer automatically on specific page types
 */
const FloatingButton = () => {
  const drawerPinned = useSettingStore((s) => s.drawerPinned)

  const containerClasses = useStyles({ drawerPinned })()
  const getFloatingButtonProps = useGetFloatingButtonProps({
    boxSize: BOX_SIZE,
  })

  return (
    <Box {...getFloatingButtonProps()}>
      <Box classes={containerClasses}>
        <Box
          component="img"
          src={iconUrl}
          width={IMG_WIDTH}
          height={IMG_WIDTH}
          style={{
            userSelect: 'none',
            userDrag: 'none',
          }}
        />
        <Box
          position="absolute"
          width={BOX_SIZE}
          height={BOX_SIZE}
          top={0}
          left={0}
          component="span"
          style={{
            cursor: 'move',
          }}
        />
      </Box>
    </Box>
  )
}

export default FloatingButton
