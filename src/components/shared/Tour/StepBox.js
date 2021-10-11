import { createPortal } from 'react-dom'
import { useEffect, useState, useRef } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'

import { useTheme } from '@material-ui/core/styles'

import { isEmpty } from 'lodash'

const getStepBoxPosition = (
  targetRect = {},
  stepBoxRect = {},
  margin,
  highlightPadding,
  position
) => {
  const { top, left, right, bottom } = targetRect
  const { height: containerHeight, width: containerWidth } = stepBoxRect

  switch (position) {
    case 'top':
      return {
        top: top - containerHeight - margin - highlightPadding,
        left: left - highlightPadding,
      }
    case 'left':
      return {
        top: top - highlightPadding,
        left: left - containerWidth - highlightPadding - margin,
      }
    case 'right':
      return {
        top: top - highlightPadding,
        left: right + highlightPadding * 2,
      }
    case 'bottom':
    default:
      return {
        top: bottom + highlightPadding + margin,
        left: left - highlightPadding,
      }
  }
}

const StepBox = ({
  highlightPadding = 30,
  margin = 20,
  isStarting,
  step,
  next,
  prev,
  isScrolling,
  currentStep,
  stepCount,
}) => {
  const theme = useTheme()
  const boxRef = useRef(null)
  const [boxPosition, setBoxPosition] = useState({})

  useEffect(() => {
    if (isStarting && !isEmpty(step) && boxRef.current && !isScrolling) {
      setBoxPosition(
        getStepBoxPosition(
          document.querySelector(step.selector).getBoundingClientRect(),
          boxRef.current.getBoundingClientRect(),
          margin,
          highlightPadding,
          step.position
        )
      )
    }
  }, [isScrolling, isStarting])

  if (!isStarting) return null

  return createPortal(
    <Box
      sx={{
        position: 'fixed',
        zIndex: 1000000,
        transition: 'transform 0.4s ease-out, opacity 0.5s',
        background: 'white',
        opacity: isScrolling ? 0.5 : 1,
        borderRadius: 4,
        padding: 12,
        maxWidth: 360,
        willChange: 'transform, opacity',
        top: 0,
        left: 0,
        transform: `translate(${boxPosition.left}px, ${boxPosition.top}px)`,
      }}
      ref={boxRef}
    >
      <Avatar
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translate(-50%, -50%)',
          width: 30,
          height: 30,
          fontSize: 16,
          background: theme.palette.primary.main,
          color: theme.palette.common.white,
        }}
      >
        {currentStep + 1}
      </Avatar>
      <Typography
        variant="body1"
        style={{
          margin: 12,
          color: '#666',
        }}
      >
        {step.content}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginLeft: 40,
          marginRight: 10,
        }}
      >
        {currentStep !== 0 && (
          <Button
            size="small"
            color="primary"
            onClick={prev}
            style={{
              textTransform: 'none',
              fontSize: 15,
              padding: '6px 16px',
            }}
          >
            PREV
          </Button>
        )}
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={next}
          style={{
            marginLeft: 20,
            textTransform: 'none',
            fontSize: 15,
            padding: '6px 16px',
          }}
        >
          {stepCount - 1 === currentStep ? 'FINISH' : 'NEXT'}
        </Button>
      </Box>
    </Box>,
    document.querySelector('body')
  )
}

export default StepBox
