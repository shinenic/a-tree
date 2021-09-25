import { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { animated } from 'react-spring'
import Avatar from '@material-ui/core/Avatar'
import moment from 'moment'

import { PJAX_ID } from 'constants/github'

import useClickOutside from 'hooks/useClickOutside'
import usePullCommitMenu from 'hooks/usePullCommitMenu'
import CopyIcon from './CopyIcon'
import * as Style from './style'

const AnimatedMenuContainer = animated(Style.MenuContainer)

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    display: 'block',
    width: '100%',
    height: '40px',
    borderBottom: '1px solid #f1f1f1',
    borderRadius: '0',
    textTransform: 'none',
    background: 'white',
  },
  buttonLabel: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  smallAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

const Commit = ({
  commit,
  sha,
  author,
  date,
  avatarClassName,
  link,
  selected,
  handleClose,
}) => {
  const authorName = commit.author?.name ?? ''
  const loginName = author?.login ?? ''
  const message = commit.message.split('\n')[0]
  const shortedSha = sha.slice(0, 6)

  return (
    <Style.StyledGithubLink
      onClick={handleClose}
      href={link}
      pjaxId={PJAX_ID.PULL}
      selected={selected}
    >
      <div>{message}</div>
      <Style.CommitDetail>
        <Avatar
          className={avatarClassName}
          src={author?.avatar_url ?? ''}
          alt={authorName}
        />
        <Style.Sha>{shortedSha}</Style.Sha>
        <div>{`${authorName} (${loginName})`}</div>
        <div>{moment(date).fromNow()}</div>
        <CopyIcon targetText={sha} />
      </Style.CommitDetail>
    </Style.StyledGithubLink>
  )
}

export default function PullCommitMenu({
  owner,
  repo,
  pull,
  commit: currentCommit,
}) {
  const classes = useStyles()
  const [menuPositionStyle, setMenuPositionStyle] = useState({})
  const {
    data,
    handleClose,
    handleButtonClick,
    buttonText,
    disabled,
    menuStyles,
  } = usePullCommitMenu({ owner, repo, pull, commit: currentCommit })

  const menuRef = useClickOutside(handleClose)

  // Calculate the fixed position of commits menu based on button's position
  useEffect(() => {
    if (!menuRef.current) return

    const buttonRect = menuRef.current.getBoundingClientRect()
    setMenuPositionStyle({
      top: buttonRect.bottom,
      left: buttonRect.left + 20,
    })
  }, [data, pull])

  if (!pull || !data) return null

  return (
    <div ref={menuRef}>
      <Button
        disabled={disabled}
        classes={{ root: classes.buttonRoot, label: classes.buttonLabel }}
        onClick={handleButtonClick}
      >
        {buttonText}
      </Button>
      <AnimatedMenuContainer style={{ ...menuStyles, ...menuPositionStyle }}>
        <Style.StyledGithubLink
          onClick={handleClose}
          href={`/${owner}/${repo}/pull/${pull}/files`}
          pjaxId={PJAX_ID.CODE}
        >
          Show all changes ({data?.length ?? 0})
        </Style.StyledGithubLink>
        {data &&
          data.map(({ commit, sha, author }) => (
            <Commit
              key={sha}
              commit={commit}
              date={commit?.committer?.date}
              sha={sha}
              author={author}
              link={`/${owner}/${repo}/pull/${pull}/commits/${sha}`}
              avatarClassName={classes.smallAvatar}
              handleClose={handleClose}
              selected={currentCommit?.includes?.(sha)}
            />
          ))}
      </AnimatedMenuContainer>
    </div>
  )
}
