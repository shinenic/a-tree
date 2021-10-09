import { useEffect, useState } from 'react'
import { animated } from 'react-spring'

import { PJAX_ID } from 'constants/github'
import useClickOutside from 'hooks/useClickOutside'
import usePullCommitMenu from 'hooks/usePullCommitMenu'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import CopyIcon from './CopyIcon'
import * as Style from './style'
import * as BaseStyle from '../style'

dayjs.extend(relativeTime)

const AnimatedMenuContainer = animated(BaseStyle.MenuContainer)

const Commit = ({ commit, sha, author, date, link, selected, handleClose }) => {
  const authorName = commit.author?.name ?? ''
  const loginName = author?.login ?? ''
  const message = commit.message.split('\n')[0]
  const shortedSha = sha.slice(0, 6)

  return (
    <BaseStyle.StyledGithubLink
      onClick={handleClose}
      href={link}
      pjaxId={PJAX_ID.PULL}
      selected={selected}
    >
      <Style.TitleBox>{message}</Style.TitleBox>
      <Style.CommitDetail>
        <BaseStyle.SmallAvatar
          src={author?.avatar_url ?? ''}
          alt={authorName}
        />
        <Style.Sha>{shortedSha}</Style.Sha>
        <div>{`${authorName} (${loginName})`}</div>
        <div>{dayjs(date).fromNow()}</div>
        <CopyIcon targetText={sha} />
      </Style.CommitDetail>
    </BaseStyle.StyledGithubLink>
  )
}

export default function PullCommitMenu({
  owner,
  repo,
  pull,
  commit: currentCommit,
}) {
  const [menuPositionStyle, setMenuPositionStyle] = useState({})
  const {
    data,
    handleClose,
    handleButtonClick,
    buttonText,
    error,
    isLoading,
    menuStyles,
    menuOpened,
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
  }, [data, pull, menuOpened])

  if (!pull || error) return null

  return (
    <div ref={menuRef}>
      <BaseStyle.ToggleButton
        disabled={error || isLoading}
        onClick={handleButtonClick}
      >
        {buttonText}
      </BaseStyle.ToggleButton>
      <AnimatedMenuContainer style={{ ...menuStyles, ...menuPositionStyle }}>
        <BaseStyle.StyledGithubLink
          onClick={handleClose}
          href={`/${owner}/${repo}/pull/${pull}/files`}
          pjaxId={PJAX_ID.CODE}
        >
          Show all changes ({data?.length ?? 0})
        </BaseStyle.StyledGithubLink>
        {data &&
          data.map(({ commit, sha, author }) => (
            <Commit
              key={sha}
              commit={commit}
              date={commit?.committer?.date}
              sha={sha}
              author={author}
              link={`/${owner}/${repo}/pull/${pull}/commits/${sha}`}
              handleClose={handleClose}
              selected={currentCommit?.includes?.(sha)}
            />
          ))}
      </AnimatedMenuContainer>
    </div>
  )
}
