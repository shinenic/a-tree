import { Box, Tooltip } from '@material-ui/core'
import { useRef, useState, useEffect } from 'react'
import { isEllipsisActive } from 'utils/dom'
import { makeStyles } from '@material-ui/core/styles'

const useTooltipStyles = makeStyles(() => ({
  popper: {
    zIndex: 9999999,
  },
  tooltip: {
    fontSize: '14px',
  },
}))

const EllipsisBox = ({
  text,
  width,
  withTooltip,
  TooltipProps,
  tooltip,
  sx,
  ...boxProps
}) => {
  const ref = useRef()
  const classes = useTooltipStyles()
  const [isEllipsis, setIsEllipsis] = useState(() =>
    isEllipsisActive(ref.current)
  )

  useEffect(() => {
    setIsEllipsis(isEllipsisActive(ref.current))
  }, [ref])

  const enableTooltip = isEllipsis && withTooltip

  if (enableTooltip) {
    return (
      <Tooltip title={tooltip || text} classes={classes} {...TooltipProps}>
        <Box
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            width,
            ...sx,
          }}
          ref={ref}
          {...boxProps}
        >
          {text}
        </Box>
      </Tooltip>
    )
  }

  return (
    <Box
      sx={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width,
      }}
      ref={ref}
      {...boxProps}
    >
      {text}
    </Box>
  )
}

export default EllipsisBox
