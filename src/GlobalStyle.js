import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin-left: ${(props) => props.pl}px;
  }
`

export default GlobalStyle
