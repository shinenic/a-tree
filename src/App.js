import usePageInfo from 'hooks/pageInfo/usePageInfo'
import MainDrawer from 'components/MainDrawer'

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()

  if (isLoading) return null

  return <MainDrawer pageInfo={pageInfo} error={error} />
}

export default App
