import usePageInfo from 'hooks/pageInfo/usePageInfo'
import MainDrawer from 'components/MainDrawer'
import useStore from 'stores/setting'
import FloatingButton from 'components/FloatingButton'

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()
  const drawerPinned = useStore((s) => s.drawerPinned)

  if (isLoading) return null

  return (
    <>
      <FloatingButton pageType={pageInfo.pageType} />
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
