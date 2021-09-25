import React, { useMemo, useState } from 'react'
import Box from '@material-ui/core/Box'
import Draggable from 'react-draggable'
import { useSettingCtx } from 'components/Setting/Context/Provider'
import { styled } from '@material-ui/core/styles'
import { getURL } from 'utils/chrome'

const BOX_SIZE = 40
const IMG_WIDTH = 30

const IconContainer = styled(Box)({
  width: BOX_SIZE,
  height: BOX_SIZE,
  backgroundColor: '#252a2e',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 3px 8px #d0d7de',
  borderRadius: '0 5px 5px 0',
  cursor: 'pointer',
  opacity: ({ drawerPinned }) => (drawerPinned ? 0.8 : 1),
  transition: 'opacity 0.1s',

  '&:hover': {
    opacity: ({ drawerPinned }) => (drawerPinned ? 0.7 : 0.9),
  },
})

const FloatingButton = () => {
  const [{ floatingButtonPositionY, drawerPinned }, dispatch] = useSettingCtx()
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

  const url = getURL('icon192.png')

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
        <IconContainer drawerPinned={drawerPinned}>
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
            width={BOX_SIZE}
            height={BOX_SIZE}
            top={0}
            left={0}
            component="span"
            style={{
              cursor: 'move',
            }}
            onMouseDown={() => setIsDragging(false)}
            onMouseMove={() => setIsDragging(true)}
          />
        </IconContainer>
      </Draggable>
    </Box>
  )
}

FloatingButton.propTypes = {}

export default FloatingButton
