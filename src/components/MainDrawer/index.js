import React, { useCallback } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { PAGE_TYPE } from 'constants'

import PullCommitMenu from 'components/Menu/PullCommit'
import Setting from 'components/Setting'
import { compact, throttle } from 'lodash'
import { useSettingCtx } from 'components/Setting/Context/Provider'
import CodePage from './Tabs/Code'
import PullPage from './Tabs/Pull'
import PullCommit from './Tabs/PullCommit'
import Error from './Tabs/Error'
import Loading from './Tabs/Loading'
import ResizableWrapper from './ResizableWrapper'

import * as Style from './style'

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
  isLoading,
  open,
}) => {
  const [{ drawerWidth }, dispatch] = useSettingCtx()
  const classes = useStyles()
  const branch = branchFromUrl || defaultBranch

  const renderHeader = () => {
    const breadcrumb = [owner, repo]

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
    if (isLoading) {
      return <Loading />
    }

    if (error) {
      return <Error errorMessage={error?.message} />
    }

    switch (pageType) {
      case PAGE_TYPE.CODE:
      default:
        return <CodePage owner={owner} repo={repo} branch={branch} />
      case PAGE_TYPE.PULL:
      case PAGE_TYPE.PULL_FILES:
        return (
          <PullPage owner={owner} repo={repo} pull={pull} pageType={pageType} />
        )
      case PAGE_TYPE.PULL_COMMIT:
        return (
          <PullCommit owner={owner} repo={repo} commit={commit} pull={pull} />
        )
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
    <Drawer anchor="left" open={open} variant="persistent" classes={classes}>
      <ResizableWrapper
        drawerWidth={drawerWidth}
        handleOnResize={handleOnResize}
      >
        <Style.DrawerHeader>{renderHeader()}</Style.DrawerHeader>
        <PullCommitMenu owner={owner} repo={repo} pull={pull} commit={commit} />
        <Style.DrawerContent>{renderContent()}</Style.DrawerContent>
        <Style.DrawerFooter>
          <Setting />
        </Style.DrawerFooter>
      </ResizableWrapper>
    </Drawer>
  )
}

MainDrawer.propTypes = {}

export default MainDrawer
