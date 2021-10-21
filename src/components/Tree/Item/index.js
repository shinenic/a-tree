import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import TreeItem from '@material-ui/lab/TreeItem'
import Collapse from '@material-ui/core/Collapse'
import { useSpring, animated } from 'react-spring'
import tinycolor from 'tinycolor2'
import useViewedFilesStore from 'stores/pull'

const TransitionComponent = (props) => {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  })

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  )
}

const HOVER_BG = '#eff2f4'
const SELECT_BG = '#d6e7fd'

const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      '&:hover': {
        backgroundColor:
          theme.palette.type === 'light'
            ? HOVER_BG
            : tinycolor
                .mix(HOVER_BG, theme.palette.background.paper, 80)
                .toHexString(),
      },
      padding: '5px 6px',
      borderRadius: '3px',
    },
    root: {
      '&:focus > $content, &$selected > $content': {
        backgroundColor:
          theme.palette.type === 'light'
            ? SELECT_BG
            : tinycolor
                .mix(SELECT_BG, theme.palette.background.paper, 80)
                .toHexString(),
      },
      '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label':
        {
          backgroundColor: 'transparent',
        },
    },
    label: {
      backgroundColor: 'transparent !important',
      userSelect: 'none',
      wordBreak: 'break-word'
    },
  })
)

const StyledTreeItem = ({ originalPath, ...rest }) => {
  const classes = useStyles()

  const isViewed = useViewedFilesStore((s) => s.viewedFileMap[originalPath])

  return (
    <TreeItem
      classes={{
        root: classes.root,
        content: classes.content,
        label: classes.label,
      }}
      TransitionComponent={TransitionComponent}
      style={{
        transition: 'opacity 0.4s',
        ...(isViewed && { opacity: 0.5 }),
      }}
      {...rest}
    />
  )
}

export default StyledTreeItem
