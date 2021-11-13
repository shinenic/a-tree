import { useQueryCommits } from 'hooks/api/useGithubQueries'
import { useSpring } from 'react-spring'
import usePopperStore from 'stores/popper'
import useSettingStore from 'stores/setting'

const usePullCommitMenu = ({ owner, repo, pull }) => {
  const isPullCommitOn = usePopperStore((s) => s.isPullCommitOn)
  const togglePullCommit = usePopperStore((s) => s.togglePullCommit)
  const isQueryEnable = useSettingStore((s) => s.drawerPinned)

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

  const menuStyles = {
    ...menuProps,
    // To keep dom alive
    visibility: menuProps.opacity.to((v) => (v === 0 ? 'hidden' : 'visible')),
  }

  return {
    data,
    isLoading,
    error,
    handleClose: () => togglePullCommit(false),
    menuStyles,
    menuOpened: isPullCommitOn,
  }
}

export default usePullCommitMenu
