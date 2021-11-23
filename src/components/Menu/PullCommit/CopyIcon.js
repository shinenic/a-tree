import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaRegCopy, FaCheck } from 'react-icons/fa'
import { BiErrorCircle } from 'react-icons/bi'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles, useTheme } from '@material-ui/core/styles'
import { useTransition, animated } from 'react-spring'
import tinycolor from 'tinycolor2'
import * as Style from './style'

const CustomTooltip = withStyles(() => ({
  tooltip: {
    fontSize: 12,
  },
}))(Tooltip)

const STATUS = {
  IDLE: 'idle',
  COPIED: 'copied',
  ERROR: 'error',
}

const AnimatedFaRegCopy = animated(FaRegCopy)
const AnimatedFaCheck = animated(FaCheck)
const AnimatedBiErrorCircle = animated(BiErrorCircle)

const { IDLE, COPIED, ERROR } = STATUS

const copyText = (text, onSuccess, onFailure) => {
  navigator.clipboard.writeText(text).then(onSuccess, onFailure)
}

const getIconColor = (color, theme) => {
  return theme.palette.type === 'dark'
    ? tinycolor(color).brighten(40).toHexString()
    : color
}

const getIcon = (status, style, theme) => {
  switch (status) {
    case IDLE:
    default:
      return (
        <AnimatedFaRegCopy
          style={style}
          color={getIconColor('#384861', theme)}
        />
      )
    case COPIED:
      return <AnimatedFaCheck style={style} color="#2ba770" />
    case ERROR:
      return <AnimatedBiErrorCircle style={style} color="#f03a47" />
  }
}

const getTooltip = (status) => {
  switch (status) {
    case IDLE:
    default:
      return 'Copy the full commit SHA'
    case COPIED:
      return 'Copy successfully!'
    case ERROR:
      return 'There is an error, please try again'
  }
}

const CopyIcon = ({ targetText }) => {
  const [status, setStatus] = useState(STATUS.IDLE)
  const transitions = useTransition(status, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  const theme = useTheme()

  const handleClick = (e) => {
    copyText(
      targetText,
      () => setStatus(COPIED),
      () => setStatus(ERROR)
    )

    // Stop navigating and keeping the commit modal opened
    e.preventDefault()
    e.stopPropagation()
  }

  useEffect(() => {
    let timer = null

    if (status !== IDLE) {
      timer = setTimeout(() => {
        setStatus(IDLE)
      }, 2500)
    }

    return () => timer && clearTimeout(timer)
  }, [status])

  return (
    <CustomTooltip title={getTooltip(status)}>
      {/* Add a div to insert Tooltip */}
      <div>
        <Style.IconBox onClick={handleClick} isIdle={status === IDLE}>
          {transitions((style, newStatus) => getIcon(newStatus, style, theme))}
        </Style.IconBox>
      </div>
    </CustomTooltip>
  )
}

CopyIcon.propTypes = {
  targetText: PropTypes.string.isRequired,
}

export default CopyIcon
