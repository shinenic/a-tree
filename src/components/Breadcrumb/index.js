import React, { Fragment } from 'react'
import { PAGE_TYPE } from 'constants'
import usePopperStore from 'stores/popper'
import Box from '@material-ui/core/Box'
import {
  AiOutlineBranches,
  AiOutlineFolder,
  AiOutlineFile,
  AiOutlineAppstore,
  AiOutlineGithub,
  AiOutlinePullRequest,
  AiOutlineFieldNumber,
  AiOutlineRight,
} from 'react-icons/ai'
import {
  linkGithubPage,
  getOwnerLink,
  getRepoLink,
  getFileLink,
  getBranchLink,
} from 'utils/link'
import EllipsisBox from 'components/shared/EllipsisBox'
import { take } from 'lodash'
import { useQueryCommits } from 'hooks/api/useGithubQueries'
import useSettingStore from 'stores/setting'

const Breadcrumb = ({
  pageType,
  owner,
  repo,
  commit,
  pull,
  branch,
  filePath,
}) => {
  const drawerPinned = useSettingStore((s) => s.drawerPinned)
  const { data: commitsData } = useQueryCommits(
    { owner, repo, pull },
    { enabled: PAGE_TYPE.PULL_COMMIT === pageType && drawerPinned }
  )

  const togglePullCommit = usePopperStore((s) => s.togglePullCommit)
  const togglePull = usePopperStore((s) => s.togglePull)

  const items = [
    {
      text: owner,
      icon: AiOutlineGithub,
      onClick: () => linkGithubPage(getOwnerLink({ owner })),
    },
    {
      text: repo,
      icon: AiOutlineAppstore,
      onClick: () => linkGithubPage(getRepoLink({ owner, repo })),
    },
  ]

  const getCommitText = () => {
    const slicedCommitSha = commit?.slice(0, 6)

    if (
      PAGE_TYPE.PULL_COMMIT === pageType &&
      commitsData &&
      commit &&
      !Array.isArray(commit)
    ) {
      const commitIndex = commitsData.findIndex(({ sha }) =>
        sha.includes(commit)
      )

      return `(${commitIndex + 1}/${commitsData.length}) ${slicedCommitSha}`
    }

    return slicedCommitSha
  }

  const branchItem = {
    text: branch,
    icon: AiOutlineBranches,
    onClick: () => linkGithubPage(getBranchLink({ owner, repo, branch })),
  }
  const commitItem = {
    text: getCommitText(),
    icon: AiOutlineFieldNumber,
    onClick: () => togglePullCommit(),
  }
  const pullItem = {
    text: pull,
    icon: AiOutlinePullRequest,
    onClick: () => togglePull(),
  }

  switch (pageType) {
    case PAGE_TYPE.CODE:
      items.push(branchItem)
      if (filePath) {
        const files = filePath.split('/')
        const fileItems = files.map((file, index) => {
          const isTreeLeaf = index === files.length - 1
          const fileLink = getFileLink({
            owner,
            repo,
            branch,
            filePath: take(files, index + 1).join('/'),
            type: isTreeLeaf ? 'blob' : 'tree',
          })

          return {
            text: file,
            icon: isTreeLeaf ? AiOutlineFile : AiOutlineFolder,
            onClick: () => linkGithubPage(fileLink),
          }
        })
        items.push(...fileItems)
      }
      break

    case PAGE_TYPE.PULLS:
      items.push({
        text: 'All Pull Requests',
        onClick: () => togglePull(),
        icon: AiOutlinePullRequest,
      })
      break

    case PAGE_TYPE.CODE_COMMIT:
      items.push(branchItem)
      items.push(commitItem)
      break

    case PAGE_TYPE.PULL:
    case PAGE_TYPE.PULL_FILES:
      items.push(pullItem)
      items.push({
        text: 'All Changes',
        onClick: () => togglePullCommit(),
      })
      break

    case PAGE_TYPE.PULL_COMMIT:
    case PAGE_TYPE.PULL_COMMITS:
      items.push(pullItem)
      items.push(commitItem)
      break

    default:
      break
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        padding: '10px 13px',
        flexWrap: 'wrap',
      }}
    >
      {items.map(({ text, icon: Icon, onClick }, index) => {
        const isClickable = !!onClick

        return (
          <Fragment key={text}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(isClickable && { cursor: 'pointer' }),
                flexWrap: 'nowrap',
                whiteSpace: 'nowrap',
              }}
              onClick={onClick}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '0 5px',
                  position: 'relative',
                  '&:after': {
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    content: '""',
                    width: '0',
                    height: '1px',
                    background: 'white',
                    transition: 'width .3s',
                  },
                  ...(isClickable && {
                    '&:hover::after': {
                      width: '100%',
                    },
                  }),
                }}
              >
                {Icon && <Icon style={{ marginRight: '3px' }} />}
                <EllipsisBox
                  text={text}
                  maxWidth="150px"
                  withTooltip
                  TooltipProps={{
                    arrow: true,
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {index !== items.length - 1 && (
                <AiOutlineRight style={{ margin: '0 3px' }} />
              )}
            </Box>
          </Fragment>
        )
      })}
    </Box>
  )
}

Breadcrumb.propTypes = {}

export default Breadcrumb
