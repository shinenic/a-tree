import GlobalStyle from './GlobalStyle'
import MainDrawer from 'components/MainDrawer'
import { PAGE_TYPE } from 'constants'
import usePageInfo from 'hooks/pageInfo/usePageInfo'
import { ERROR_MESSAGE } from 'constants'

const { UNKNOWN, UNSUPPORTED } = PAGE_TYPE
const HANDLED_ERRORS = [
  ERROR_MESSAGE.TOKEN_INVALID,
  ERROR_MESSAGE.NO_PERMISSION,
]

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()

  console.log({ error, isLoading, pageInfo })

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
      <GlobalStyle />
      <MainDrawer {...pageInfo} error={error} />
    </>
  )
}

export default App
