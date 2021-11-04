import usePageInfo from 'hooks/pageInfo/usePageInfo'
import MainDrawer from 'components/MainDrawer'
import GlobalProvider from 'providers/GlobalProvider'

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()

  if (isLoading) return null

  return (
    <GlobalProvider>
      <MainDrawer pageInfo={pageInfo} error={error} />
    </GlobalProvider>
  )
}

export default App
