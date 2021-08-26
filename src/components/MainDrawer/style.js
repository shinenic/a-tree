import styled from 'styled-components'

export const DrawerHeader = styled.div`
  background: rgb(55, 62, 67);
  height: 62px;
  box-sizing: border-box;
  color: white;
  display: flex;
  align-items: center;
  padding-left: 20px;
`

export const DrawerFooter = styled.div`
  width: 100%;
  background: white;
  height: 44px;
  display: flex;
  align-items: center;
`

export const DrawerContent = styled.div`
  padding: 14px;
  flex: 1;
  overflow: auto;

  /* width */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f188;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #bbb8;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #8888;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
