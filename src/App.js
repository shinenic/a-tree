import usePageInfo from 'hooks/pageInfo/usePageInfo'
import MainDrawer from 'components/MainDrawer'
import { useSettingStateCtx } from 'components/Setting/Context/Provider'
import FloatingButton from 'components/FloatingButton'
import GlobalStyle from './GlobalStyle'

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()
  const { drawerWidth, drawerPinned } = useSettingStateCtx()

  if (isLoading) return null

  return (
    <>
      <FloatingButton />
      <GlobalStyle pl={drawerPinned ? drawerWidth : 0} />
      <MainDrawer
        {...pageInfo}
        error={error}
        isLoading={isLoading}
        open={drawerPinned}
      />
    </>
  )
}

export default App
