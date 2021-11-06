import React, { useCallback } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { ERROR_MESSAGE } from 'constants'
import useContextMenu from 'stores/contextMenu'
import { Box } from '@material-ui/core'

import PullCommitMenu from 'components/Menu/PullCommit'
import PullMenu from 'components/Menu/Pull'
import { SettingButton } from 'components/Setting'
import { throttle } from 'lodash'
import useSettingStore from 'stores/setting'
import GlobalStyle from 'GlobalStyle'
import { getHeaderHeight } from 'utils/style'
import FloatingButton from 'components/FloatingButton'
import FileSearch from 'components/FileSearchModal'
import ContextMenu from 'components/ContextMenu'
import Breadcrumb from 'components/Breadcrumb'
import SearchBar from 'components/SearchBar'

import useSwitch from 'hooks/useSwitch'
import Error from './Tabs/Error'
import TreeTab from './Tabs'
import ResizableWrapper from './ResizableWrapper'

import * as Style from './style'

const useStyles = makeStyles((theme) => ({
  paper: {
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%)',
    borderRight: theme.palette.type === 'dark' ? '1px solid #ffffff40' : 'none',
    overflowX: 'hidden',
  },
}))

const MainDrawer = ({ pageInfo, error }) => {
  const { pageType, owner, repo, commit, pull } = pageInfo

  const drawerWidth = useSettingStore((s) => s.drawerWidth)
  const disablePageTypeList = useSettingStore((s) => s.disablePageTypeList)
  const dispatch = useSettingStore((s) => s.dispatch)
  const drawerPinned = useSettingStore((s) => s.drawerPinned)
  const [
    isFileSearchModalOpen,
    openFileSearchModal,
    closeFileSearchModal,
    toggleFileSearchModal,
  ] = useSwitch()

  const openContextMenu = useContextMenu((s) => s.openContextMenu)

  const classes = useStyles()

  const renderContent = () => {
    if (error) {
      return <Error errorMessage={error?.message} />
    }

    return <TreeTab {...pageInfo} />
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnResize = useCallback(
    throttle((_, __, element) => {
      dispatch({
        type: 'UPDATE_DRAWER_WIDTH',
        payload: element.clientWidth,
      })
    }, 100),
    []
  )

  if (
    error?.message === ERROR_MESSAGE.NOT_SUPPORTED_PAGE ||
    error?.message === ERROR_MESSAGE.NOT_FOUND_PAGE ||
    disablePageTypeList.includes(pageType)
  ) {
    return <GlobalStyle pl={0} />
  }

  return (
    <>
      <GlobalStyle pl={drawerPinned ? drawerWidth : 0} />
      <FloatingButton pageType={pageType} />
      <ContextMenu {...pageInfo} />
      <FileSearch
        pageInfo={pageInfo}
        isOpen={isFileSearchModalOpen}
        onOpen={openFileSearchModal}
        onClose={closeFileSearchModal}
      />
      <Drawer
        anchor="left"
        open={drawerPinned}
        variant="persistent"
        classes={classes}
        onContextMenu={(event) => {
          openContextMenu(event)
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        <ResizableWrapper
          drawerWidth={drawerWidth}
          handleOnResize={handleOnResize}
        >
          <Style.DrawerHeader height={getHeaderHeight()}>
            <Breadcrumb {...pageInfo} />
          </Style.DrawerHeader>
          <Box padding="10px" height={55}>
            <SearchBar onClick={() => toggleFileSearchModal()} />
          </Box>
          <PullCommitMenu
            owner={owner}
            repo={repo}
            pull={pull}
            commit={commit}
          />
          <PullMenu owner={owner} repo={repo} pull={pull} />
          <Style.DrawerContent>{renderContent()}</Style.DrawerContent>
          <Style.DrawerFooter>
            <SettingButton />
          </Style.DrawerFooter>
        </ResizableWrapper>
      </Drawer>
    </>
  )
}

MainDrawer.propTypes = {}

export default MainDrawer
