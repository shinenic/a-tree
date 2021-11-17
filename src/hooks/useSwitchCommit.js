import { useEffect } from 'react'
import { useQueryCommits } from 'hooks/api/useGithubQueries'
import { PULL_PAGE_TYPE } from 'constants'
import { getPullCommitLink, linkGithubPage } from 'utils/link'
import useSettingStore from 'stores/setting'
import { invert } from 'lodash'

export default function useSwitchCommit({
  owner,
  repo,
  pull,
  currentCommit,
  pageType,
}) {
  const disableHotkey = useSettingStore((s) => s.disableCommitSwitchHotkey)
  const { data } = useQueryCommits({ owner, repo, pull })

  const isPullPage = invert(PULL_PAGE_TYPE)[pageType]

  useEffect(() => {
    if (!isPullPage || !data || disableHotkey) return

    const currentSha = currentCommit || currentCommit?.[0] || null
    const goToCommitByIndex = (index) => {
      linkGithubPage(
        getPullCommitLink({ owner, repo, pull, sha: data[index].sha })
      )
    }

    const keydownHandler = (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key) || !e.shiftKey) return

      const isNextHotkey = e.key === 'ArrowRight'
      e.preventDefault()

      // Go to first / last commit if no commit selected
      if (currentSha === null) {
        goToCommitByIndex(isNextHotkey ? 0 : data.length - 1)
        return
      }

      const currentIndex = data.findIndex(({ sha }) => sha === currentSha)

      if (isNextHotkey && currentIndex < data.length - 1 && currentIndex >= 0) {
        goToCommitByIndex(currentIndex + 1)
      } else if (!isNextHotkey && currentIndex > 0) {
        goToCommitByIndex(currentIndex - 1)
      }
    }

    window.addEventListener('keydown', keydownHandler)

    return () => {
      window.removeEventListener('keydown', keydownHandler)
    }
  }, [currentCommit, data, disableHotkey, isPullPage, owner, pull, repo])
}
