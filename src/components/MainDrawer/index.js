import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { PAGE_TYPE } from 'constants'

import CodePage from './Tabs/Code'
import PullPage from './Tabs/Pull'
import PullCommit from './Tabs/PullCommit'
import Error from './Tabs/Error'
import PullCommitMenu from 'components/Menu/PullCommit'
import Setting from 'components/Setting'

import { compact } from 'lodash'
import * as Style from './style'

const useStyles = makeStyles({
  paper: {
    width: 400,
    display: 'flex',
    flexDirection: 'column',
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

  return (
    <Drawer anchor="left" open variant="permanent" classes={classes}>
      <Style.DrawerHeader>{renderHeader()}</Style.DrawerHeader>
      <PullCommitMenu owner={owner} repo={repo} pull={pull} commit={commit} />
      <Style.DrawerContent>{renderContent()}</Style.DrawerContent>
      <Style.DrawerFooter>
        <Setting />
      </Style.DrawerFooter>
    </Drawer>
  )
}

MainDrawer.propTypes = {}

export default MainDrawer
