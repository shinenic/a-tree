import { makeStyles } from '@material-ui/core'

const useDynamicGlobalStyle = (pl) =>
  makeStyles(() => ({
    '@global': {
      html: {
        marginLeft: `${pl}px !important`,
      },
    },
  }))

const GlobalStyle = ({ pl }) => {
  useDynamicGlobalStyle(pl)()

  return null
}

export default GlobalStyle
