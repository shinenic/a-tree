import useMousePosition from 'hooks/useMousePosition'
import { useState, useEffect } from 'react'

const useMenuPosition = ({
  isMenuOpen,
  anchorElement,
  followCursor = true,
  offset = 20,
}) => {
  const [menuPosition, setMenuPosition] = useState({})

  const mousePosition = useMousePosition({ event: 'click', capture: true })

  useEffect(() => {
    if (!isMenuOpen) return

    if (followCursor || !anchorElement) {
      setMenuPosition({ x: mousePosition.x + offset, y: mousePosition.y + offset })
      return
    }

    const { bottom, left } = anchorElement.getBoundingClientRect()
    setMenuPosition({
      x: left + 20,
      y: bottom,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen])

  return menuPosition
}

export default useMenuPosition
