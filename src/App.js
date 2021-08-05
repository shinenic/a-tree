import GlobalStyle from './GlobalStyle'
import MainDrawer from 'components/MainDrawer'
import { PAGE_TYPE } from 'constants'
import usePageInfo from 'hooks/pageInfo/usePageInfo'

const { UNKNOWN, UNSUPPORTED } = PAGE_TYPE

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()

  console.log({ error, isLoading, pageInfo })

  if (
    pageInfo.pageType === UNKNOWN ||
    pageInfo.pageType === UNSUPPORTED ||
    error ||
    isLoading
  ) {
    return null
  }

  return (
    <>
      <GlobalStyle />
      <MainDrawer {...pageInfo} />
    </>
  )
}

export default App
