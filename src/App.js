import usePageInfo from 'hooks/pageInfo/usePageInfo'
import MainDrawer from 'components/MainDrawer'
import useStore from 'stores/setting'
import FloatingButton from 'components/FloatingButton'
import GlobalStyle from './GlobalStyle'

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()
  const drawerWidth = useStore((s) => s.drawerWidth)
  const drawerPinned = useStore((s) => s.drawerPinned)

  if (isLoading) return null

  return (
    <>
      <FloatingButton pageType={pageInfo.pageType} />
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
