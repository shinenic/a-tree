import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { PAGE_TYPE } from 'constants'

import CodePage from 'components/pages/Code'
import PullPage from 'components/pages/Pull'
import PullCommit from 'components/pages/PullCommit'
import PullCommitMenu from 'components/Menu/PullCommit'

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
    </Drawer>
  )
}

MainDrawer.propTypes = {}

export default MainDrawer
