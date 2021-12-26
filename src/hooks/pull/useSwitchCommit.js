import { useEffect } from 'react'
import { useQueryCommits } from 'hooks/api/useGithubQueries'
import { PULL_PAGE_TYPE } from 'constants/base'
import { getPullCommitLink, linkGithubPage } from 'utils/link'
import useSettingStore from 'stores/setting'
import { invert } from 'lodash'

// iterate all textarea elements and check if any of them are focused
const checkIfEnteringText = () => {
  const textAreas = document.querySelectorAll('textarea')
  const inputs = document.querySelectorAll('input[type="text"]')

  if (textAreas.length === 0 && inputs.length === 0) return false

  return (
    Array.from(textAreas).some((el) => el.matches(':focus')) ||
    Array.from(inputs).some((el) => el.matches(':focus'))
  )
}

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
      // Skip if no hotkeys matched
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key) || !e.shiftKey) return
      // Skip if user is entering text
      if (checkIfEnteringText()) return

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
