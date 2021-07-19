import GlobalStyle from './GlobalStyle'
import MainDrawer from 'components/MainDrawer'
import usePageInfo from 'hooks/usePageInfo'
import { PAGE_TYPE } from 'constants'

function App() {
  const pageInfo = usePageInfo()

  console.log('pageInfo', pageInfo)
  if (pageInfo.pageType === PAGE_TYPE.UNKNOWN) return null

  return (
    <>
      <GlobalStyle />
      <MainDrawer {...pageInfo} />
    </>
  )
}

export default App
