import React, { useMemo, useState } from 'react'
import Box from '@material-ui/core/Box'
import Draggable from 'react-draggable'
import { useSettingCtx } from 'components/Setting/Context/Provider'

const HEIGHT = 40
const WIDTH = 40

const IMG_WIDTH = 25

const FloatingButton = () => {
  const [{ floatingButtonPositionY }, dispatch] = useSettingCtx()
  const [isDragging, setIsDragging] = useState(false)

  // Memorized original position y because the implementation of `react-draggable` is
  // to use `transform` to control the element, if we update position y immediately,
  // the position y would be doubled (position Y + transform Y),
  // so we need to keep original Y to make <Draggable> controllable and
  // update local storage's Y as soon as we finished dragging.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const originalPositionY = useMemo(
    () =>
      // >=1 is impossible, means the data is dirty, should reset it to prevent button missing
      (floatingButtonPositionY >= 1 ? 0.5 : floatingButtonPositionY) *
      window.innerHeight,
    []
  )

  const url = window.chrome.runtime.getURL('icon192.png')

  return (
    <Box
      position="fixed"
      top={originalPositionY}
      left={0}
      zIndex={2100}
      onMouseUp={() => {
        if (isDragging) return

        dispatch({ type: 'TOGGLE_DRAWER' })
      }}
    >
      <Draggable
        axis="y"
        defaultPosition={{ x: 0, y: 0 }}
        handle="span"
        onStop={(_, { y }) => {
          dispatch({
            type: 'UPDATE_FLOATING_BUTTON_POSITION_Y',
            payload: (y + originalPositionY) / window.innerHeight,
          })
        }}
      >
        <Box
          width={WIDTH}
          height={HEIGHT}
          bgcolor="#252a2e"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="0 5px 5px 0"
          style={{
            cursor: 'pointer',
          }}
        >
          <Box
            component="img"
            src={url}
            width={IMG_WIDTH}
            height={IMG_WIDTH}
            style={{
              userSelect: 'none',
              userDrag: 'none',
            }}
          />
          <Box
            position="absolute"
            width={WIDTH}
            height={HEIGHT}
            top={0}
            left={0}
            component="span"
            style={{
              cursor: 'move',
            }}
            onMouseDown={() => setIsDragging(false)}
            onMouseMove={() => setIsDragging(true)}
          />
        </Box>
      </Draggable>
    </Box>
  )
}

FloatingButton.propTypes = {}

export default FloatingButton
