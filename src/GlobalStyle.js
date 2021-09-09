import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin-left: ${(props) => props.pl}px !important;
  }
`

export default GlobalStyle
