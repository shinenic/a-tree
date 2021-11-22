import { animated } from 'react-spring'

import { PJAX_ID } from 'constants/github'
import useClickOutside from 'hooks/useClickOutside'
import usePullCommitMenu from 'hooks/usePullCommitMenu'
import useSwitchCommit from 'hooks/useSwitchCommit'
import { getPullCommitLink } from 'utils/link'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useMenuPosition from 'hooks/menu/useMenuPosition'

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
      pjaxId={PJAX_ID.REPO}
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

/**
 * @TODO Disable query when drawer unpinned
 * @TODO Lazy load the rest pulls
 */
export default function PullCommitMenu({
  owner,
  repo,
  pull,
  commit: currentCommit,
  pageType,
  anchorElement,
  followCursor,
}) {
  const { data, handleClose, error, menuStyles, menuOpened } =
    usePullCommitMenu({ owner, repo, pull })

  useSwitchCommit({ owner, repo, pull, currentCommit, pageType })

  const menuRef = useClickOutside(handleClose)
  const menuPosition = useMenuPosition({
    isMenuOpen: menuOpened,
    anchorElement,
    followCursor,
  })

  if (!pull || error) return null

  return (
    <div ref={menuRef}>
      <AnimatedMenuContainer
        style={{ ...menuStyles, top: menuPosition.y, left: menuPosition.x }}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <BaseStyle.StyledGithubLink
          onClick={handleClose}
          href={`/${owner}/${repo}/pull/${pull}/files`}
          pjaxId={PJAX_ID.CONTENT}
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
              link={getPullCommitLink({ owner, repo, pull, sha })}
              handleClose={handleClose}
              selected={currentCommit?.includes?.(sha)}
            />
          ))}
      </AnimatedMenuContainer>
    </div>
  )
}
