import React, { useMemo, useCallback, useEffect, useRef } from 'react'
import Box from '@material-ui/core/Box'
import Draggable from 'react-draggable'
import useSettingStore from 'stores/setting'
import { makeStyles } from '@material-ui/core/styles'
import { getURL } from 'utils/chrome'
import useWindowSize from 'hooks/useWindowSize'
import { getHeaderHeight } from 'utils/style'
import { DEFAULT_HEADER_HEIGHT } from 'constants'

const BOX_SIZE = 40
const IMG_WIDTH = 30

const TOGGLE_THRESHOLD = 6

const iconUrl = getURL('icon192.png')

const useStyles = ({ drawerPinned }) =>
  makeStyles((theme) => ({
    root: {
      width: BOX_SIZE,
      height: BOX_SIZE,
      backgroundColor: '#252a2e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: theme.shadows[2],
      borderLeft: 'none',
      borderRadius: '0 5px 5px 0',
      cursor: 'pointer',
      opacity: drawerPinned ? 0.8 : 1,
      transition: 'opacity 0.1s',

      '&:hover': {
        opacity: drawerPinned ? 0.7 : 0.9,
      },
    },
  }))

/**
 * @TODO Check do we need to hide the floating button and drawer at the same time?
 *       Or close drawer automatically on specific page types
 */
const FloatingButton = () => {
  const floatingButtonPositionY = useSettingStore((s) => s.floatingButtonPositionY)
  const drawerPinned = useSettingStore((s) => s.drawerPinned)
  const dispatch = useSettingStore((s) => s.dispatch)

  const { height: windowHeight } = useWindowSize()
  const originY = useRef(floatingButtonPositionY)
  const containerClasses = useStyles({ drawerPinned })()

  const headerHeight = useMemo(() => {
    const heightNumber = Number(getHeaderHeight().replace(/\D+/g, ''))
    return Number.isNaN(heightNumber) || heightNumber === 0
      ? DEFAULT_HEADER_HEIGHT
      : heightNumber
  }, [])

  const onStart = useCallback((_, { y }) => {
    originY.current = y
  }, [])

  const onStop = useCallback((_, { y }) => {
    if (Math.abs(y - originY.current) < TOGGLE_THRESHOLD) {
      dispatch({ type: 'TOGGLE_DRAWER' })
    }
  }, [])

  const updateY = useCallback((_, { y }) => {
    dispatch({
      type: 'UPDATE_FLOATING_BUTTON_POSITION_Y',
      payload: y,
    })
  }, [])

  useEffect(() => {
    if (windowHeight - BOX_SIZE < floatingButtonPositionY) {
      dispatch({
        type: 'UPDATE_FLOATING_BUTTON_POSITION_Y',
        payload: windowHeight - BOX_SIZE,
      })
    }
  }, [windowHeight])

  return (
    <Box position="fixed" top={0} left={0} zIndex={2100}>
      <Draggable
        axis="y"
        defaultPosition={{ x: floatingButtonPositionY, y: 0 }}
        handle="span"
        onDrag={updateY}
        position={{ y: floatingButtonPositionY, x: 0 }}
        bounds={{
          top: headerHeight,
          bottom: windowHeight - BOX_SIZE,
        }}
        onStart={onStart}
        onStop={onStop}
      >
        <Box classes={containerClasses}>
          <Box
            component="img"
            src={iconUrl}
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
          />
        </Box>
      </Draggable>
    </Box>
  )
}

FloatingButton.propTypes = {}

export default FloatingButton
