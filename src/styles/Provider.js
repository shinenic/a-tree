import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import { getNativeBodyStyles } from 'utils/style'
import tinycolor from 'tinycolor2'
import { useMemo, useEffect, useState } from 'react'

const defaultTheme = createTheme()

const getTheme = () => {
  const bgColor = getNativeBodyStyles().backgroundColor
  const textColor = getNativeBodyStyles().color

  const isDarkTheme = tinycolor(bgColor).isDark()

  return {
    isDarkTheme,
    bgColor: {
      primary: bgColor,
      secondary: isDarkTheme
        ? tinycolor(bgColor).brighten(20).toHexString()
        : tinycolor(bgColor).darken(20).toHexString(),
    },
    textColor: {
      primary: textColor,
      secondary: isDarkTheme
        ? tinycolor(textColor).darken(20).toHexString()
        : tinycolor(textColor).brighten(20).toHexString(),
    },
  }
}

function MainThemeProvider({ children }) {
  const [nativeColorMode, setNativeColorMode] = useState(null)

  /**
   * Listen github native color mode
   */
  useEffect(() => {
    const callback = () => {
      const newColorMode = document
        .querySelector('html')
        .getAttribute('data-color-mode')
      setNativeColorMode(newColorMode)
    }

    const observer = new MutationObserver(callback)

    observer.observe(document.querySelector('html'), {
      attributes: true,
      childList: false,
      subtree: false,
    })

    return () => observer.disconnect()
  }, [])

  const theme = useMemo(
    () => {
      const themeConfig = getTheme()

      return createTheme({
        palette: {
          type: themeConfig.isDarkTheme ? 'dark' : 'light',
          primary: {
            main: themeConfig.isDarkTheme
              ? tinycolor
                  .mix(
                    themeConfig.textColor.primary,
                    defaultTheme.palette.primary.main
                  )
                  .toHexString()
              : defaultTheme.palette.primary.main,
          },
          secondary: {
            main: themeConfig.isDarkTheme
              ? tinycolor
                  .mix(
                    themeConfig.textColor.primary,
                    defaultTheme.palette.secondary.main
                  )
                  .toHexString()
              : defaultTheme.palette.secondary.main,
          },
          text: {
            primary: themeConfig.textColor.primary,
            secondary: themeConfig.textColor.secondary,
          },
          background: {
            paper: themeConfig.bgColor.primary,
            default: themeConfig.bgColor.secondary,
          },
        },
        overrides: {
          MuiDrawer: {
            paper: {
              backgroundColor: themeConfig.bgColor.primary,
              color: themeConfig.textColor.primary,
            },
          },
          MuiPaper: {
            root: {
              backgroundColor: themeConfig.bgColor.primary,
              color: themeConfig.textColor.primary,
            },
          },
          MuiBackdrop: {
            root: {
              backgroundColor: `rgba(0, 0, 0, ${
                themeConfig.isDarkTheme ? '0.6' : '0.5'
              })`,
            },
          },
        },
      })
    },
    // Update theme only when native `data-color-mode` changed
    [nativeColorMode] // eslint-disable-line
  )

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default MainThemeProvider
