import { useState, useEffect } from 'react'
import { useSpring } from 'react-spring'
import { useQueryPulls } from 'hooks/api/useGithubQueries'

import { isEmpty } from 'lodash'

const DEFAULT_BUTTON_TEXT = 'See all pull requests'

const usePullMenu = ({ owner, repo, pull }) => {
  const [menuOpened, setMenuOpened] = useState(false)
  const [buttonText, setButtonText] = useState(DEFAULT_BUTTON_TEXT)

  const menuProps = useSpring({
    transform: menuOpened ? 'scale(1)' : 'scale(0.9)',
    transformOrigin: 'top',
    opacity: menuOpened ? 1 : 0,
    reset: true,
  })

  const { data, isLoading, error } = useQueryPulls({
    owner,
    repo,
    pull,
  })

  const hasData = !isEmpty(data)
  useEffect(() => {
    if (!pull || !hasData) return

    const selectedPull = data.find(({ number }) => number === pull)

    if (selectedPull) {
      setButtonText(`#${selectedPull.number} ${selectedPull.title}`)
    } else {
      setButtonText(DEFAULT_BUTTON_TEXT)
    }
  }, [hasData, pull])

  const handleButtonClick = () => {
    if (isLoading) return

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
    disabled: error || isLoading,
    handleClose,
    handleButtonClick,
    buttonText,
    menuStyles,
  }
}

export default usePullMenu
