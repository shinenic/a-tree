import { useState, useEffect } from 'react'
import { useQueryCommits } from 'hooks/api/useGithubQueries'
import { useSpring } from 'react-spring'

import { isEmpty } from 'lodash'

const DEFAULT_BUTTON_TEXT = 'Select commit to see changes'

/**
 * In case the page is in `PULL_COMMIT`,
 * which means we need to get the full commits in the beginning,
 * we query the commits in both `PULL` and `PULL_COMMIT` page.
 */
const usePullCommitMenu = ({ owner, repo, pull, commit }) => {
  const [menuOpened, setMenuOpened] = useState(false)
  const [buttonText, setButtonText] = useState(DEFAULT_BUTTON_TEXT)

  const menuProps = useSpring({
    transform: menuOpened ? 'scale(1)' : 'scale(0.9)',
    transformOrigin: 'top',
    opacity: menuOpened ? 1 : 0,
    reset: true,
  })

  const { data, isLoading, error } = useQueryCommits({
    owner,
    repo,
    pull,
  })

  const hasData = !isEmpty(data)
  useEffect(() => {
    /**
     * @TODO support multiple commits
     */
    if (Array.isArray(commit)) return

    if (!commit) {
      setButtonText(DEFAULT_BUTTON_TEXT)
    } else if (hasData && commit && Array.isArray(data)) {
      const commitInfo = data.find(({ sha }) => sha === commit)

      /**
       * @TODO Handle latest commit when someone push commit to the branch.
       */
      if (commitInfo) {
        const commitIndex = data.findIndex(({ sha }) => sha === commit) + 1

        setButtonText(
          `(${commitIndex}/${data.length}) ${commitInfo.sha.slice(0, 5)} ${
            commitInfo.commit.message
          }`
        )
      }
    }
  }, [commit, hasData])

  const handleButtonClick = () => {
    if (isLoading || error) return

    setMenuOpened((prev) => !prev)
  }

  const handleClose = () => {
    setMenuOpened(false)
  }

  const menuStyles = {
    ...menuProps,
    // To keep dom alive
    visibility: menuProps.opacity.to((v) => (v === 0 ? 'hidden' : 'visible')),
  }

  return {
    data,
    isLoading,
    error,
    handleClose,
    handleButtonClick,
    buttonText,
    menuStyles,
    menuOpened,
  }
}

export default usePullCommitMenu
