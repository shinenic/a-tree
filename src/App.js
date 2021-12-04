import usePageInfo from 'hooks/pageInfo/usePageInfo'

import { ERROR_MESSAGE } from 'constants/base'
import useSettingStore from 'stores/setting'

import MainDrawer from 'components/MainDrawer'
import GlobalStyle from 'GlobalStyle'
import FloatingButton from 'components/FloatingButton'
import FileSearch from 'components/FileSearchModal'
import ContextMenu from 'components/ContextMenu'

import FileIcons from 'components/FileIcons'

function App() {
  const { error, isLoading, pageInfo } = usePageInfo()
  const { pageType } = pageInfo || {}

  const disablePageTypeList = useSettingStore((s) => s.disablePageTypeList)

  if (isLoading) return null

  if (
    error?.message === ERROR_MESSAGE.NOT_SUPPORTED_PAGE ||
    error?.message === ERROR_MESSAGE.NOT_FOUND_PAGE ||
    disablePageTypeList.includes(pageType)
  ) {
    // To recover the global style when the drawer disabled
    return <GlobalStyle disabled />
  }

  return (
    <>
      <FileIcons />
      <GlobalStyle />
      <FloatingButton pageType={pageType} />
      <ContextMenu {...pageInfo} />
      <FileSearch pageInfo={pageInfo} />
      <MainDrawer pageInfo={pageInfo} error={error} />
    </>
  )
}

export default App
