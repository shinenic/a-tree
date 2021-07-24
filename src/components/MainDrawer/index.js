import React from 'react'
import PropTypes from 'prop-types'
import Drawer from '@material-ui/core/Drawer'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import { PAGE_TYPE } from 'constants'

import { useQueryRepoInfo } from 'hooks/api/useGithubQueries'
import CodePage from 'components/pages/Code'
import PRPage from 'components/pages/PR'

import { isEmpty, compact } from 'lodash'
import * as Style from './style'

const useStyles = makeStyles({
  paper: {
    width: 400,
    // borderRightColor: 'black',
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
}) => {
  const classes = useStyles()

  const { data, loading, error } = useQueryRepoInfo({ owner, repo })

  if (loading || isEmpty(data)) return null

  const { default_branch: defaultBranch } = data
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

    if (pageType === PAGE_TYPE.PR_COMMIT) {
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
        return <PRPage owner={owner} repo={repo} pull={pull} />
    }
  }

  return (
    <Drawer anchor="left" open variant="permanent" classes={classes}>
      <Style.DrawerHeader>{renderHeader()}</Style.DrawerHeader>
      <Style.DrawerContent>{renderContent()}</Style.DrawerContent>
    </Drawer>
  )
}

MainDrawer.propTypes = {}

export default MainDrawer
