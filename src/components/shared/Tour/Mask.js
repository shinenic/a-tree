import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

import useWindowSize from 'hooks/useWindowSize'
import { isEmpty } from 'lodash'

const buildPath = (windowHeight, windowWidth, { height, width, left, top }) => {
  return `M 0,0 l ${windowWidth},0 0,${windowHeight} -${windowWidth},0 z M ${left},${top} l ${width},0 0,${height} -${width},0 z`
}

const SvgMask = ({
  highlightPadding = 30,
  isStarting,
  step,
  handleClick,
  isScrolling,
}) => {
  const [target, setTarget] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const { height: windowHeight, width: windowWidth } = useWindowSize()

  useEffect(() => {
    if (!isStarting || isEmpty(step)) return

    if (isScrolling) {
      setTarget((prev) => ({
        top: prev.top + highlightPadding + prev.height / 2,
        left: prev.left + highlightPadding + prev.width / 2,
        height: 0,
        width: 0,
      }))
    } else {
      const { top, left, height, width } = document
        .querySelector(step.selector)
        ?.getBoundingClientRect?.()

      setTarget({
        top: top - highlightPadding,
        left: left - highlightPadding,
        height: height + highlightPadding * 2,
        width: width + highlightPadding * 2,
      })
    }
  }, [isScrolling, isStarting])

  if (isEmpty(target)) return null

  return createPortal(
    <svg
      viewBox={`0 0 ${windowWidth} ${windowHeight}`}
      width={windowWidth}
      height={windowHeight}
      style={{
        position: 'fixed',
        zIndex: 999999,
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
      onClick={handleClick}
    >
      <path
        d={buildPath(windowHeight, windowWidth, target)}
        fill="#6668"
        fillRule="evenodd"
        style={{
          pointerEvents: 'auto',
          transition: 'd 400ms',
          willChange: 'd',
        }}
      />
    </svg>,
    document.querySelector('body')
  )
}

export default SvgMask
