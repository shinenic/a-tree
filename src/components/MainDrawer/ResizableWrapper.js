import React from 'react'
import { Resizable } from 're-resizable'
import { styled } from '@material-ui/core/styles'

const Handler = styled('div')({
  width: '8px',
  height: '100%',

  '&:hover': {
    borderLeft: '1px solid #8a8a8a'
  }
})

const resizableProps = {
  style: {
    display: 'flex',
    flexDirection: 'column'
  },
  enable: {
    top: false,
    right: true,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false
  },
  maxWidth: '40vw',
  minWidth: 200,
  handleStyles: {
    right: {
      width: '8px',
      right: '-7px'
    }
  },
  handleComponent: {
    right: <Handler />
  }
}

const ResizableWrapper = ({ drawerWidth, handleOnResize, ...props }) => {
  return (
    <Resizable
      size={{
        width: drawerWidth,
        height: '100%'
      }}
      onResize={handleOnResize}
      {...resizableProps}
      {...props}
    />
  )
}

ResizableWrapper.propTypes = {}

export default ResizableWrapper
