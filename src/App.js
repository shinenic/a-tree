import FileSearchModal from 'components/FileSearchModal'
import MainDrawer from 'components/MainDrawer'
import usePageInfo from 'hooks/pageInfo/usePageInfo'

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()

  if (isLoading) return null

  return (
    <>
      <MainDrawer {...pageInfo} error={error} />
      <FileSearchModal {...pageInfo} />
    </>
  )
}

export default App
