import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    margin-left: ${(props) => props.pl}px !important;
  }
`

export default GlobalStyle
