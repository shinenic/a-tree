import Skeleton from '@material-ui/lab/Skeleton'
import { random } from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

export const LabelTextSkeleton = () => {
  return (
    <Box height="24px" display="flex" alignItems="center" ml="4px">
      <Skeleton variant="text" width={`${random(35, 90)}%`} height={14} />
    </Box>
  )
}

const useStyles = makeStyles({
  root: {
    borderRadius: '4px',
  },
})

export const IconSkeleton = () => {
  const classes = useStyles()

  return <Skeleton variant="rect" width={14} height={16} classes={classes} />
}

export const placeholderDeepTree = [
  'b/f.js',
  'e.js',
  'a/d.js',
  'a/aa/aaa/c.js',
  'a/aa/aab/b.js',
  'a/aa/aac/abc/a.js',
  'a/aa/aac/abc/b.js',
  'a/aa/aac/abc/c.js',
  'a/g.js',
  'f.js',
].map((filename) => ({ filename }))

export const placeholderFlattenTree = Array.from({ length: 16 }).map(
  (_, index) => ({
    filename: `${index}.js`,
  })
)
