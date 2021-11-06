import React, { useCallback } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import useContextMenuStore from 'stores/contextMenu'
import { Box } from '@material-ui/core'

import PullCommitMenu from 'components/Menu/PullCommit'
import PullMenu from 'components/Menu/Pull'
import { SettingButton } from 'components/Setting'
import { throttle } from 'lodash'
import useSettingStore from 'stores/setting'
import { getHeaderHeight } from 'utils/style'
import Breadcrumb from 'components/Breadcrumb'
import SearchBar from 'components/SearchBar'
import usePopperStore from 'stores/popper'

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
  const { owner, repo, commit, pull } = pageInfo

  const drawerWidth = useSettingStore((s) => s.drawerWidth)
  const dispatch = useSettingStore((s) => s.dispatch)
  const drawerPinned = useSettingStore((s) => s.drawerPinned)

  const openContextMenu = useContextMenuStore((s) => s.openContextMenu)
  const toggleFileSearch = usePopperStore((s) => s.toggleFileSearch)

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

  return (
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
          <SearchBar onClick={() => toggleFileSearch(true)} />
        </Box>
        <PullCommitMenu owner={owner} repo={repo} pull={pull} commit={commit} />
        <PullMenu owner={owner} repo={repo} pull={pull} />
        <Style.DrawerContent>{renderContent()}</Style.DrawerContent>
        <Style.DrawerFooter>
          <SettingButton />
        </Style.DrawerFooter>
      </ResizableWrapper>
    </Drawer>
  )
}

MainDrawer.propTypes = {}

export default MainDrawer
