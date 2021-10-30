import React, { Fragment } from 'react'
import { PAGE_TYPE } from 'constants'
import { useGlobalContext } from 'providers/GlobalProvider'
import Box from '@material-ui/core/Box'
import {
  AiOutlineBranches,
  AiOutlineFile,
  AiOutlineAppstore,
  AiOutlineGithub,
  AiOutlinePullRequest,
  AiOutlineFieldNumber,
  AiOutlineRight,
} from 'react-icons/ai'

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
    { text: owner, icon: AiOutlineGithub },
    { text: repo, icon: AiOutlineAppstore },
  ]

  const branchItem = { text: branch, icon: AiOutlineBranches }
  const fileItem = { text: filePath, icon: AiOutlineFile }
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
      if (filePath) items.push(fileItem)
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
      items.push(pullItem)
      items.push(commitItem)
      break

    default:
      break
  }

  return (
    <Box
      sx={{
        overflowX: 'scroll',
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
                {text}
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
