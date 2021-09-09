import GlobalStyle from './GlobalStyle'
import MainDrawer from 'components/MainDrawer'
import usePageInfo from 'hooks/pageInfo/usePageInfo'
import FileSearchModal from 'components/FileSearchModal'
import { useSettingStateCtx } from 'components/Setting/Context/Provider'

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()
  const { drawerWidth } = useSettingStateCtx()

  return (
    <>
      <GlobalStyle pl={drawerWidth} />
      <MainDrawer {...pageInfo} error={error} isLoading={isLoading} />
      <FileSearchModal {...pageInfo} />
    </>
  )
}

export default App
