import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import * as Style from './style'

const Loading = () => {
  return (
    <Style.Container>
      <CircularProgress />
    </Style.Container>
  )
}

export default Loading
