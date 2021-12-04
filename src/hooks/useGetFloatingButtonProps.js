import { useMemo, useCallback, useEffect, useRef, useState } from 'react'
import useSettingStore from 'stores/setting'
import useWindowSize from 'hooks/useWindowSize'
import { getHeaderHeight } from 'utils/style'
import { DEFAULT_HEADER_HEIGHT } from 'constants/base'

const BOX_SIZE = 40
const TOGGLE_THRESHOLD = 3

// support only Y-axis
const useGetFloatingButtonProps = ({
  boxSize = 0,
  dragThreshold = TOGGLE_THRESHOLD,
} = {}) => {
  const positionY = useSettingStore((s) => s.floatingButtonPositionY)
  const dispatch = useSettingStore((s) => s.dispatch)
  const { height: windowHeight } = useWindowSize()

  const [isMouseDown, setIsMouseDown] = useState(false)

  const startPageYRef = useRef(null)
  const startYRef = useRef(null)

  const updatePositionY = useCallback(
    (y) => dispatch({ type: 'UPDATE_FLOATING_BUTTON_POSITION_Y', payload: y }),
    [dispatch]
  )

  const topBound = useMemo(() => {
    const heightNumber = Number(getHeaderHeight().slice(0, -2))
    return Number.isNaN(heightNumber) || heightNumber === 0
      ? DEFAULT_HEADER_HEIGHT
      : heightNumber
  }, [])

  const onMouseDown = (e) => {
    setIsMouseDown(true)

    startPageYRef.current = e.pageY
    startYRef.current = positionY
  }

  useEffect(() => {
    if (!isMouseDown) return

    let isOverThreshold = false

    const onMouseUp = () => {
      setIsMouseDown(false)

      if (!isOverThreshold) {
        dispatch({ type: 'TOGGLE_DRAWER' })
      }
    }

    const onMouseMove = (e) => {
      e.preventDefault() // prevent select background unexpectedly
      const deltaY = e.pageY - startPageYRef.current

      if (Math.abs(deltaY) < dragThreshold) return

      isOverThreshold = true

      const newPositionY = startYRef.current + deltaY
      const bottomBound = windowHeight - boxSize

      if (newPositionY < topBound) {
        updatePositionY(topBound)
      } else if (newPositionY > bottomBound) {
        updatePositionY(bottomBound)
      } else {
        updatePositionY(newPositionY)
      }
    }

    // Listen whole document after mouse down to increase the detection area
    document.addEventListener('mouseup', onMouseUp, true)
    document.addEventListener('mousemove', onMouseMove, true)

    return () => {
      document.removeEventListener('mouseup', onMouseUp, true)
      document.removeEventListener('mousemove', onMouseMove, true)
    }
  }, [isMouseDown]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (windowHeight - BOX_SIZE < positionY) {
      dispatch({
        type: 'UPDATE_FLOATING_BUTTON_POSITION_Y',
        payload: windowHeight - BOX_SIZE,
      })
    }
  }, [windowHeight]) // eslint-disable-line react-hooks/exhaustive-deps

  return () => ({
    onMouseDown,
    style: {
      transform: `translateY(${positionY}px)`,
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 2100,
    },
  })
}

export default useGetFloatingButtonProps
