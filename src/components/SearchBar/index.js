import { useEffect, useState } from 'react'
import InputBase from '@material-ui/core/InputBase'
import Box from '@material-ui/core/Box'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { AiOutlineSearch } from 'react-icons/ai'
import useSettingStore from 'stores/setting'
import { HOTKEY_ADORNMENT } from 'constants/base'

import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: theme.palette.primary,
    width: '100%'
  },
  inputInput: {
    fontWeight: '300'
  }
}))

const SearchBar = ({
  onClick,
  onChange,
  withBorder = true,
  showHints = true,
  showLoadingHint = true,
  inputRef,
  placeholder = 'Search...',
  isLoading,
  isDebouncing
}) => {
  const fileSearchHotkey = useSettingStore((s) => s.fileSearchHotkey)
  const classes = useStyles()
  const theme = useTheme()
  const borderStyle =
    withBorder &&
    {
      dark: {
        border: `1px solid ${theme.palette.grey[700]}`,
        borderRadius: '5px'
      },
      light: {
        border: `1px solid ${theme.palette.grey[200]}`,
        borderRadius: '5px'
      }
    }[theme.palette.type]

  return (
    <Box
      display="flex"
      padding="2px 15px"
      {...borderStyle}
      boxSizing="border-box"
      alignItems="center"
      onClick={onClick}
      onChange={onChange}
      height="100%"
    >
      <AiOutlineSearch size="1.5rem" style={{ marginRight: '8px' }} color="#aab2bd" />
      <InputBase
        placeholder={placeholder}
        inputRef={inputRef}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ 'aria-label': 'search' }}
        disabled={isLoading}
      />
      {showHints && (
        <Box style={{ whiteSpace: 'nowrap' }} fontWeight="300">
          {`${HOTKEY_ADORNMENT}${fileSearchHotkey.toUpperCase()}`}
        </Box>
      )}
      {showLoadingHint && (
        <Box style={{ whiteSpace: 'nowrap' }} fontWeight="300">
          <DebouncingLoadingIcon isLoading={isDebouncing || isLoading} />
        </Box>
      )}
    </Box>
  )
}

const DebouncingLoadingIcon = ({ isLoading }) => {
  const [shouldShowSpinner, setShouldShowSpinner] = useState(isLoading)

  useEffect(() => {
    let timer = null

    if (!isLoading) {
      // Defer hiding the loading spinner
      timer = setTimeout(() => setShouldShowSpinner(false), 500)
    } else {
      setShouldShowSpinner(true)
    }

    return () => timer && clearTimeout(timer)
  }, [isLoading])

  if (!shouldShowSpinner) return null

  return <CircularProgress size={18} />
}

export default SearchBar
