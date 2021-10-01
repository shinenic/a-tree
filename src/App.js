import usePageInfo from 'hooks/pageInfo/usePageInfo'
import MainDrawer from 'components/MainDrawer'
import useStore from 'stores/setting'

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()
  const drawerPinned = useStore((s) => s.drawerPinned)

  if (isLoading) return null

  return (
    <MainDrawer
      {...pageInfo}
      error={error}
      isLoading={isLoading}
      open={drawerPinned}
    />
  )
}

export default App
