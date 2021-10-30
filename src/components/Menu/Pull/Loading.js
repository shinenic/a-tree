import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from '@material-ui/lab/Skeleton'
import Box from '@material-ui/core/Box'

const Loading = () => {
  return (
    <Box sx={{ padding: '20px' }}>
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </Box>
  )
}

Loading.propTypes = {}

export default Loading
