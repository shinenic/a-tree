import React, { useCallback } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { PAGE_TYPE } from 'constants'

import CodePage from './Tabs/Code'
import PullPage from './Tabs/Pull'
import PullCommit from './Tabs/PullCommit'
import Error from './Tabs/Error'
import PullCommitMenu from 'components/Menu/PullCommit'
import Setting from 'components/Setting'
import { Resizable } from 're-resizable'

import { compact, throttle } from 'lodash'
import * as Style from './style'
import { useSettingCtx } from 'components/Setting/Context/Provider'

const useStyles = makeStyles({
  paper: {
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%)',
    borderRight: 'none',
    overflowX: 'hidden',
  },
})

const MainDrawer = ({
  pageType,
  owner,
  repo,
  commit,
  pull,
  branch: branchFromUrl,
  filePath,
  defaultBranch,
  error,
}) => {
  const [{ drawerWidth }, dispatch] = useSettingCtx()
  const classes = useStyles()
  const branch = branchFromUrl || defaultBranch

  const renderHeader = () => {
    let breadcrumb = [owner, repo]

    if (pageType === PAGE_TYPE.CODE) {
      breadcrumb.push(branch)
      breadcrumb.push(filePath)
    }

    if (pageType === PAGE_TYPE.COMMIT) {
      breadcrumb.push(branch)
      breadcrumb.push(commit)
    }

    if (pageType === PAGE_TYPE.PULL) {
      breadcrumb.push(pull)
    }

    if (pageType === PAGE_TYPE.PULL_COMMIT) {
      breadcrumb.push(pull)
      breadcrumb.push(commit)
    }

    return compact(breadcrumb).join('  >  ')
  }

  const renderContent = () => {
    if (error) {
      return <Error errorMessage={error?.message} />
    }

    switch (pageType) {
      case PAGE_TYPE.CODE:
      default:
        return <CodePage owner={owner} repo={repo} branch={branch} />
      case PAGE_TYPE.PULL:
        return <PullPage owner={owner} repo={repo} pull={pull} />
      case PAGE_TYPE.PULL_COMMIT:
        return <PullCommit owner={owner} repo={repo} commit={commit} />
    }
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
    <Drawer anchor="left" open variant="permanent" classes={classes}>
      <Resizable
        size={{
          width: drawerWidth,
          height: '100%',
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        onResize={handleOnResize}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        maxWidth="40vw"
        minWidth={350}
      >
        <Style.DrawerHeader>{renderHeader()}</Style.DrawerHeader>
        <PullCommitMenu owner={owner} repo={repo} pull={pull} commit={commit} />
        <Style.DrawerContent>{renderContent()}</Style.DrawerContent>
        <Style.DrawerFooter>
          <Setting />
        </Style.DrawerFooter>
      </Resizable>
    </Drawer>
  )
}

MainDrawer.propTypes = {}

export default MainDrawer
