import GlobalStyle from './GlobalStyle'
import MainDrawer from 'components/MainDrawer'
import { PAGE_TYPE } from 'constants'
import usePageInfo from 'hooks/pageInfo/usePageInfo'
import { ERROR_MESSAGE } from 'constants'
import FileSearchModal from 'components/FileSearchModal'
import { useSettingStateCtx } from 'components/Setting/Context/Provider'

const { UNKNOWN, UNSUPPORTED } = PAGE_TYPE
const HANDLED_ERRORS = [
  ERROR_MESSAGE.TOKEN_INVALID,
  ERROR_MESSAGE.NO_PERMISSION,
]

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()
  const { drawerWidth } = useSettingStateCtx()

  if (
    pageInfo.pageType === UNKNOWN ||
    pageInfo.pageType === UNSUPPORTED ||
    isLoading ||
    (error && !HANDLED_ERRORS.includes(error?.message))
  ) {
    return null
  }

  return (
    <>
      <GlobalStyle pl={drawerWidth} />
      <MainDrawer {...pageInfo} error={error} />
      <FileSearchModal {...pageInfo} />
    </>
  )
}

export default App
