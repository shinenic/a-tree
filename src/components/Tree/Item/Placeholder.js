import ListItem from '@material-ui/core/ListItem'

import {
  LabelTextSkeleton,
  IconSkeleton,
} from 'components/MainDrawer/Tabs/Loading/placeholder'

import { useNodeStyle, BASE_PADDING, LEVEL_ADDITIONAL_PADDING } from './style'

const TreeItemPlaceholder = ({ data: { nestingLevel }, style }) => {
  const classes = useNodeStyle()

  return (
    <ListItem
      disableGutters
      button
      disabled
      style={{
        ...style,
        marginLeft: nestingLevel * LEVEL_ADDITIONAL_PADDING + BASE_PADDING,
        transition: 'opacity 0.4s',
        width: `calc(100% - ${
          nestingLevel * LEVEL_ADDITIONAL_PADDING + BASE_PADDING * 2
        }px)`,
        opacity: 1,
      }}
    >
      <div className={classes.iconRoot}>
        <IconSkeleton />
      </div>
      <LabelTextSkeleton />
    </ListItem>
  )
}

export default TreeItemPlaceholder
