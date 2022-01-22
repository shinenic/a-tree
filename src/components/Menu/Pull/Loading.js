import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import Box from '@material-ui/core/Box'
import { random } from 'lodash'
import { useTheme } from '@material-ui/core'

const FirstOptionSkeleton = () => {
  return (
    <Box sx={{ padding: '14px' }}>
      <Skeleton variant="text" width={160} height={22} animation="wave" />
    </Box>
  )
}

const buildSkeletonItem = (key) => {
  return (
    <Box
      sx={{
        padding: '8px 14px',
        '& > span:not(:first-child)': { marginTop: 4 }
      }}
      key={key}
    >
      <Skeleton variant="text" width={`${random(50, 90)}%`} height={20} animation="wave" />
      <Skeleton variant="text" width={`${random(40, 70)}%`} height={20} animation="wave" />
      <Skeleton variant="text" width={`${random(40, 60)}%`} height={20} animation="wave" />
    </Box>
  )
}

const LOADING_ITEM_COUNT = 4

const Loading = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        '& > div:not(:first-child)': {
          borderTop: `1px solid ${
            theme.palette.type === 'dark' ? theme.palette.text.secondary : '#e1e4e8'
          }`
        }
      }}
    >
      <FirstOptionSkeleton />
      {Array.from({ length: LOADING_ITEM_COUNT }).map((_, index) => buildSkeletonItem(index))}
    </Box>
  )
}

export default Loading
