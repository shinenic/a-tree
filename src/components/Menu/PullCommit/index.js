import { useMemo, useEffect, useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import { VariableSizeList as List } from 'react-window'

import { PJAX_ID } from 'constants/github'
import useClickOutside from 'hooks/useClickOutside'
import useSwitchCommit from 'hooks/useSwitchCommit'
import { getPullCommitLink } from 'utils/link'
import { useQueryCommits } from 'hooks/api/useGithubQueries'
import { COMMIT_BTN_ID } from 'components/Breadcrumb'

import usePopperStore from 'stores/popper'
import useSettingStore from 'stores/setting'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useMenuPosition from 'hooks/menu/useMenuPosition'

import CopyIcon from './CopyIcon'
import * as Style from './style'
import * as BaseStyle from '../style'

const { useVizListContainerStyle } = BaseStyle

dayjs.extend(relativeTime)

const Commit = ({
  commit,
  sha,
  author,
  date,
  link,
  selected,
  handleClose,
  ...rest
}) => {
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
      {...rest}
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

const rowHeight = (index) => (index ? 72 : 52)

const Row = ({ index, style, data }) => {
  const { Component, ...props } = data[index]

  return <Component style={style} {...props} />
}

const AnimatedContainer = animated(BaseStyle.MenuContainer)

const getSelectedCommits = (commitsData, currentCommit) => {
  if (!commitsData || !currentCommit) return []

  if (!Array.isArray(currentCommit)) {
    return [currentCommit]
  }

  const startIndex = commitsData.findIndex((commit) =>
    commit.sha.includes(currentCommit[0])
  )
  const endIndex = commitsData.findIndex((commit) =>
    commit.sha.includes(currentCommit[1])
  )

  return commitsData.slice(startIndex, endIndex + 1).map((commit) => commit.sha)
}

/**
 * @TODO Listen Esc hotkey
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
  const classes = useVizListContainerStyle()
  const isPullCommitOn = usePopperStore((s) => s.isPullCommitOn)
  const togglePullCommit = usePopperStore((s) => s.togglePullCommit)
  const isQueryEnable = useSettingStore((s) => s.drawerPinned)
  const handleClose = () => togglePullCommit(false)

  useSwitchCommit({ owner, repo, pull, currentCommit, pageType })

  const menuProps = useSpring({
    transform: isPullCommitOn ? 'scale(1)' : 'scale(0.9)',
    transformOrigin: 'top',
    opacity: isPullCommitOn ? 1 : 0,
    reset: true,
  })

  const { data, isLoading, error } = useQueryCommits(
    { owner, repo, pull },
    { enabled: isQueryEnable }
  )

  const selectedCommits = getSelectedCommits(data, currentCommit)

  const vizListRef = useRef(null)
  const menuRef = useClickOutside(handleClose, isPullCommitOn, [COMMIT_BTN_ID])
  const menuPosition = useMenuPosition({
    isMenuOpen: isPullCommitOn,
    anchorElement,
    followCursor,
  })

  const listItemData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data.reduce(
      (result, { commit, sha, author }) => {
        result.push({
          key: sha,
          id: `commit-menu-${sha}`,
          Component: Commit,
          commit,
          date: commit?.committer?.date,
          sha,
          author,
          link: getPullCommitLink({ owner, repo, pull, sha }),
          handleClose,
          selected: selectedCommits?.includes?.(sha),
        })

        return result
      },
      [
        {
          key: pull,
          Component: BaseStyle.StyledGithubLink,
          onClick: handleClose,
          href: `/${owner}/${repo}/pull/${pull}/files`,
          pjaxId: PJAX_ID.CONTENT,
          children: `Show all changes (${data?.length ?? 0})`,
        },
      ]
    )
  }, [data])

  const shouldApplyViz = (listItemData?.length ?? 0) > 30

  // Scroll to current commit after opened the menu
  useEffect(() => {
    if (!data || data.length === 0) return

    if (!isPullCommitOn || !currentCommit) return

    if (shouldApplyViz) {
      if (!vizListRef.current?.scrollToItem) return

      const index = data.findIndex((commit) =>
        commit.sha.includes(
          Array.isArray(currentCommit) ? currentCommit[0] : currentCommit
        )
      )

      vizListRef.current.scrollToItem(index + 1, 'center')
      return
    }

    const sha = Array.isArray(currentCommit) ? currentCommit[0] : currentCommit

    const target = document.getElementById(`commit-menu-${sha}`)
    if (target) {
      target.scrollIntoView()
    }
  }, [isPullCommitOn])

  // @TODO handle loading status
  if (!pull || error || isLoading) return null

  const containerStyle = {
    ...menuProps,
    top: menuPosition.y,
    left: menuPosition.x,
    visibility: menuProps.opacity.to((v) => (v === 0 ? 'hidden' : 'visible')),
  }

  const containerProps = {
    style: containerStyle,
    ref: menuRef,
    onContextMenu: (e) => e.stopPropagation(),
  }

  if (shouldApplyViz) {
    return (
      <animated.div className={classes.root} {...containerProps}>
        <List
          height={600}
          ref={vizListRef}
          itemCount={listItemData.length}
          itemData={listItemData}
          itemSize={rowHeight}
          width={540}
        >
          {Row}
        </List>
      </animated.div>
    )
  }

  return (
    <AnimatedContainer {...containerProps}>
      {listItemData.map(({ Component, ...props }) => (
        <Component {...props} />
      ))}
    </AnimatedContainer>
  )
}
