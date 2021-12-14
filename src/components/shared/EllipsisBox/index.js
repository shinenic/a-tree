import { Box, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useEllipsis from 'hooks/useEllipsis'

export const useTooltipStyles = makeStyles(() => ({
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
  const [ref, isEllipsis] = useEllipsis()

  const classes = useTooltipStyles()
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
        ...sx,
      }}
      ref={ref}
      {...boxProps}
    >
      {text}
    </Box>
  )
}

export default EllipsisBox
