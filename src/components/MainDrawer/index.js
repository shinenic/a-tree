import React, { useCallback } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { PAGE_TYPE, ERROR_MESSAGE } from 'constants'

import PullCommitMenu from 'components/Menu/PullCommit'
import Setting from 'components/Setting'
import { compact, throttle } from 'lodash'
import { useSettingCtx } from 'components/Setting/Context/Provider'
import GlobalStyle from 'GlobalStyle'
import CodePage from './Tabs/Code'
import PullPage from './Tabs/Pull'
import PullCommit from './Tabs/PullCommit'
import Error from './Tabs/Error'
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
}) => {
  const [{ drawerWidth }, dispatch] = useSettingCtx()
  const classes = useStyles()
  const branch = branchFromUrl || defaultBranch

  const renderHeader = () => {
    const breadcrumb = [owner, repo]

    switch (pageType) {
      case PAGE_TYPE.CODE:
      case PAGE_TYPE.PULLS:
        breadcrumb.push(branch)
        breadcrumb.push(filePath)
        break

      case PAGE_TYPE.CODE_COMMIT:
        breadcrumb.push(branch)
        breadcrumb.push(commit)
        break

      case PAGE_TYPE.PULL:
      case PAGE_TYPE.PULL_FILES:
        breadcrumb.push(pull)
        break

      case PAGE_TYPE.PULL_COMMIT:
        breadcrumb.push(pull)
        breadcrumb.push(commit)
        break

      default:
        break
    }

    return compact(breadcrumb).join('  >  ')
  }

  /**
   * @TODO support commit page
   */
  const renderContent = () => {
    if (error) {
      return <Error errorMessage={error?.message} />
    }

    switch (pageType) {
      case PAGE_TYPE.PULL:
      case PAGE_TYPE.PULL_FILES:
        return (
          <PullPage owner={owner} repo={repo} pull={pull} pageType={pageType} />
        )
      case PAGE_TYPE.PULL_COMMIT:
        return (
          <PullCommit owner={owner} repo={repo} commit={commit} pull={pull} />
        )
      default:
        return <CodePage owner={owner} repo={repo} branch={branch} />
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnResize = useCallback(
    throttle((_, __, element) => {
      const width = element.clientWidth < 200 ? 5 : element.clientWidth

      dispatch({
        type: 'UPDATE_DRAWER_WIDTH',
        payload: width,
      })
    }, 100),
    []
  )

  if (error?.message === ERROR_MESSAGE.NOT_SUPPORTED_PAGE) return null

  return (
    <>
      <GlobalStyle pl={drawerWidth} />
      <Drawer anchor="left" open variant="permanent" classes={classes}>
        <ResizableWrapper
          drawerWidth={drawerWidth}
          handleOnResize={handleOnResize}
        >
          <Style.DrawerHeader>{renderHeader()}</Style.DrawerHeader>
          <PullCommitMenu
            owner={owner}
            repo={repo}
            pull={pull}
            commit={commit}
          />
          <Style.DrawerContent>{renderContent()}</Style.DrawerContent>
          <Style.DrawerFooter>
            <Setting />
          </Style.DrawerFooter>
        </ResizableWrapper>
      </Drawer>
    </>
  )
}

MainDrawer.propTypes = {}

export default MainDrawer
