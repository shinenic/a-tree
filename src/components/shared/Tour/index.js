import { useReducer, useEffect } from 'react'
import useSwitch from 'hooks/useSwitch'

import { scrollTo } from 'utils/scroll'

import useWindowSize from 'hooks/useWindowSize'
import { reducer, initialState } from './reducer'

import Mask from './Mask'
import StepBox from './StepBox'

/**
 * @TODO Refactor `isScrolling` for better UX
 */
function Tour({ isOpening = false, customSteps = [] }) {
  const [isScrolling, setScrolling, setNotScrolling] = useSwitch()
  const { height: windowHeight } = useWindowSize()
  const [{ isStarting, steps, currentStep }, dispatch] = useReducer(
    reducer,
    initialState
  )

  useEffect(() => {
    dispatch({ type: 'SET_STEPS', payload: { steps: customSteps } })
  }, [customSteps])

  useEffect(() => {
    if (isOpening) {
      dispatch({ type: 'START' })
    }
  }, [isOpening])

  useEffect(() => {
    if (!isStarting) return null

    setScrolling()

    scrollTo(document.querySelector(steps[currentStep].selector), {
      callback: () => setNotScrolling(),
      smooth: true,
      offsetY: windowHeight / 2,
    })

    return () => setNotScrolling()
  }, [isStarting, currentStep])

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Escape':
          dispatch({ type: 'NEXT' })
          break
        case 'ArrowLeft':
          dispatch({ type: 'PREV' })
          break
        default:
          break
      }
    }

    if (isStarting) {
      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isStarting])

  if (!isStarting) return null

  return (
    <>
      <Mask
        isStarting={isStarting}
        currentStep={currentStep}
        step={steps[currentStep]}
        handleClick={() => dispatch({ type: 'NEXT' })}
        isScrolling={isScrolling}
      />
      <StepBox
        isStarting={isStarting}
        currentStep={currentStep}
        stepCount={steps.length}
        step={steps[currentStep]}
        next={() => dispatch({ type: 'NEXT' })}
        prev={() => dispatch({ type: 'PREV' })}
        isScrolling={isScrolling}
      />
    </>
  )
}

export default Tour
