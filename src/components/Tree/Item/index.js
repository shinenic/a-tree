import React from 'react'
import { alpha, makeStyles, withStyles } from '@material-ui/core/styles'
import TreeItem from '@material-ui/lab/TreeItem'
import Collapse from '@material-ui/core/Collapse'
import { useSpring, animated } from 'react-spring'

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

const useStyles = makeStyles({
  content: {
    '&:hover': {
      backgroundColor: '#eff2f4',
    },
    padding: '5px 6px',
    borderRadius: '3px',
  },
  root: {
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `#d6e7fd`,
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label':
      {
        backgroundColor: 'transparent',
      },
  },
  label: {
    backgroundColor: 'transparent !important',
  },
})

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => {
  const classes = useStyles()

  return (
    <TreeItem
      {...props}
      classes={{
        root: classes.root,
        content: classes.content,
        label: classes.label,
      }}
      TransitionComponent={TransitionComponent}
    />
  )
})

StyledTreeItem.propTypes = {}

export default StyledTreeItem
