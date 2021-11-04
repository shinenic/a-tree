import React, { Fragment } from 'react'
import { PAGE_TYPE } from 'constants'
import { useGlobalContext } from 'providers/GlobalProvider'
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
import EllipsisBox from 'components/EllipsisBox'

const Breadcrumb = ({
  pageType,
  owner,
  repo,
  commit,
  pull,
  branch,
  filePath,
}) => {
  const { togglePullMenu, togglePullCommitMenu } = useGlobalContext()

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

  const branchItem = {
    text: branch,
    icon: AiOutlineBranches,
    onClick: () => linkGithubPage(getBranchLink({ owner, repo, branch })),
  }
  const commitItem = {
    text: commit,
    icon: AiOutlineFieldNumber,
    onClick: () => togglePullCommitMenu(),
  }
  const pullItem = {
    text: pull,
    icon: AiOutlinePullRequest,
    onClick: () => togglePullMenu(),
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
            filePath: file,
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
        onClick: () => togglePullMenu(),
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
        onClick: () => togglePullCommitMenu(),
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
                  ...(isClickable && {
                    '&:hover': {
                      borderBottom: '1px solid white',
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
