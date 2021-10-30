import React, { useCallback } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { PAGE_TYPE, ERROR_MESSAGE } from 'constants'

import PullCommitMenu from 'components/Menu/PullCommit'
import PullMenu from 'components/Menu/Pull'
import { SettingButton } from 'components/Setting'
import { compact, throttle } from 'lodash'
import useStore from 'stores/setting'
import GlobalStyle from 'GlobalStyle'
import { getHeaderHeight } from 'utils/style'
import FloatingButton from 'components/FloatingButton'
import FileSearch from 'components/FileSearchModal'
import Breadcrumb from 'components/Breadcrumb'

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

  const drawerWidth = useStore((s) => s.drawerWidth)
  const disablePageTypeList = useStore((s) => s.disablePageTypeList)
  const dispatch = useStore((s) => s.dispatch)
  const drawerPinned = useStore((s) => s.drawerPinned)
  const [
    isFileSearchModalOpen,
    openFileSearchModal,
    closeFileSearchModal,
    toggleFileSearchModal,
  ] = useSwitch()

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
      <FileSearch {...pageInfo} />
      <Drawer
        anchor="left"
        open={drawerPinned}
        variant="persistent"
        classes={classes}
      >
        <ResizableWrapper
          drawerWidth={drawerWidth}
          handleOnResize={handleOnResize}
        >
          <Style.DrawerHeader height={getHeaderHeight()}>
            {renderHeader()}
          </Style.DrawerHeader>
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
