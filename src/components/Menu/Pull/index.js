import { animated, useSpring } from 'react-spring'

import { PJAX_ID } from 'constants/github'
import useClickOutside from 'hooks/useClickOutside'
import { useTheme } from '@material-ui/core/styles'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PULL_BTN_ID } from 'components/Breadcrumb'

import { useQueryPulls } from 'hooks/api/useGithubQueries'
import Chip from '@material-ui/core/Chip'
import tinycolor from 'tinycolor2'
import usePopperStore from 'stores/popper'
import useSettingStore from 'stores/setting'
import useMenuPosition from 'hooks/menu/useMenuPosition'

import Loading from './Loading'

import * as Style from './style'
import * as BaseStyle from '../style'

dayjs.extend(relativeTime)

const AnimatedMenuContainer = animated(BaseStyle.MenuContainer)

const Pull = ({
  number,
  createAt,
  userName,
  avatarUrl,
  link,
  handleClose,
  selected,
  fromBranch,
  toBranch,
  title,
  labels
}) => (
  <BaseStyle.StyledGithubLink
    onClick={handleClose}
    href={link}
    pjaxId={PJAX_ID.REPO}
    selected={selected}
  >
    <div>
      <Style.PRNumber>{`#${number}`}</Style.PRNumber>
      <b>{title}</b>
    </div>
    <Style.BranchesBox>
      <Chip variant="outlined" size="small" label={toBranch} style={{ cursor: 'pointer' }} />
      <div>{' ← '}</div>
      <Chip variant="outlined" size="small" label={fromBranch} style={{ cursor: 'pointer' }} />
    </Style.BranchesBox>
    <Style.LabelsBox>
      {labels && labels.map((label) => <Label key={label.id} {...label} />)}
    </Style.LabelsBox>
    <Style.CommitDetail>
      <div>Created by</div>
      <div>
        <b>{userName}</b>
      </div>
      <BaseStyle.SmallAvatar src={avatarUrl} alt={userName} />
      <div>{dayjs(createAt).fromNow()}</div>
    </Style.CommitDetail>
  </BaseStyle.StyledGithubLink>
)

function Label({ name, color }) {
  const theme = useTheme()
  const backgroundColor = `#${color}`

  const isDarkLabel = tinycolor(backgroundColor).isDark()
  const isDarkTheme = theme.palette.type === 'dark'

  const textColor =
    isDarkLabel ^ isDarkTheme // eslint-disable-line
      ? theme.palette.background.paper
      : theme.palette.text.primary

  return (
    <Chip
      size="small"
      label={name}
      style={{ backgroundColor, color: textColor, cursor: 'pointer' }}
    />
  )
}

/**
 * @TODO Lazy load the rest pulls
 */
export default function PullMenu({ owner, repo, pull, anchorElement, followCursor }) {
  const drawerPinned = useSettingStore((s) => s.drawerPinned)
  const isPullOn = usePopperStore((s) => s.isPullOn)
  const togglePull = usePopperStore((s) => s.togglePull)
  const menuProps = useSpring({
    transform: isPullOn ? 'scale(1)' : 'scale(0.9)',
    transformOrigin: 'top',
    opacity: isPullOn ? 1 : 0,
    reset: true
  })
  const menuStyles = {
    ...menuProps,
    // To keep dom alive
    visibility: menuProps.opacity.to((v) => (v === 0 ? 'hidden' : 'visible'))
  }

  const { data, isLoading, error } = useQueryPulls(
    { owner, repo },
    { enabled: isPullOn && drawerPinned }
  )

  const closeMenu = () => togglePull(false)

  const menuRef = useClickOutside(closeMenu, isPullOn, [PULL_BTN_ID])
  const menuPosition = useMenuPosition({
    isMenuOpen: isPullOn,
    anchorElement,
    followCursor
  })

  if (error) return null

  return (
    <div ref={menuRef}>
      <AnimatedMenuContainer
        style={{ ...menuStyles, top: menuPosition.y, left: menuPosition.x }}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <BaseStyle.StyledGithubLink
              onClick={closeMenu}
              href={`/${owner}/${repo}/pulls`}
              pjaxId={PJAX_ID.REPO}
            >
              All pull requests list
            </BaseStyle.StyledGithubLink>
            {data &&
              data.map(
                ({
                  html_url: link,
                  number,
                  title,
                  user: { login: userName, avatar_url: avatarUrl },
                  created_at: createAt,
                  labels = [],
                  head,
                  base
                }) => {
                  const isFork = head?.repo?.fork

                  const fromBranch = isFork ? head.label : head.ref
                  const toBranch = isFork ? base.label : base.ref
                  return (
                    <Pull
                      key={number}
                      number={number}
                      createAt={createAt}
                      userName={userName}
                      avatarUrl={avatarUrl}
                      link={link}
                      handleClose={closeMenu}
                      selected={pull === number}
                      fromBranch={fromBranch}
                      toBranch={toBranch}
                      title={title}
                      labels={labels}
                    />
                  )
                }
              )}
          </>
        )}
      </AnimatedMenuContainer>
    </div>
  )
}
