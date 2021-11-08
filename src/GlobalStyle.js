import { makeStyles } from '@material-ui/core'
import useSettingStore from 'stores/setting'

const useDynamicGlobalStyle = (pl) =>
  makeStyles(() => ({
    '@global': {
      html: {
        marginLeft: `${pl}px !important`,
      },
    },
  }))

const GlobalStyle = ({ disabled = false }) => {
  const drawerWidth = useSettingStore((s) => s.drawerWidth)
  const drawerPinned = useSettingStore((s) => s.drawerPinned)

  useDynamicGlobalStyle(disabled || !drawerPinned ? 0 : drawerWidth)()

  return null
}

export default GlobalStyle
