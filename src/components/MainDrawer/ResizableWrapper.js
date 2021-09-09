import React from 'react'
import { Resizable } from 're-resizable'
import styled from 'styled-components'

const Handler = styled.div`
  width: 8px;
  height: 100%;

  &:hover {
    border-left: 1px solid #8a8a8a;
  }
`

const ResizableWrapper = ({ children, drawerWidth, handleOnResize }) => {
  return (
    <Resizable
      size={{
        width: drawerWidth,
        height: '100%',
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
      onResize={handleOnResize}
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      maxWidth="40vw"
      minWidth={10}
      handleStyles={{
        right: {
          width: '8px',
          right: '-7px',
        },
      }}
      handleComponent={{
        right: <Handler />,
      }}
    >
      {children}
    </Resizable>
  )
}

ResizableWrapper.propTypes = {}

export default ResizableWrapper
