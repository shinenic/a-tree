import React from 'react'
import InputBase from '@material-ui/core/InputBase'
import Box from '@material-ui/core/Box'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { AiOutlineSearch } from 'react-icons/ai'
import { BsCommand } from 'react-icons/bs'

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: theme.palette.primary,
    width: '100%',
  },
  inputInput: {
    fontWeight: '300',
  },
}))

const SearchBar = ({
  onClick,
  onChange,
  withBorder = true,
  showHints = true,
  inputRef,
  placeholder = 'Search...',
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const borderStyle =
    withBorder &&
    {
      dark: {
        border: `1px solid ${theme.palette.grey[700]}`,
        borderRadius: '5px',
      },
      light: {
        border: `1px solid ${theme.palette.grey[200]}`,
        borderRadius: '5px',
      },
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
      <AiOutlineSearch
        size="1.5rem"
        style={{ marginRight: '8px' }}
        color="#aab2bd"
      />
      <InputBase
        placeholder={placeholder}
        inputRef={inputRef}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
      {showHints && (
        <>
          <BsCommand size="1rem" />
          <Box fontWeight="300" margin="0 3px">
            +
          </Box>
          <Box fontWeight="300">K</Box>
        </>
      )}
    </Box>
  )
}

SearchBar.propTypes = {}

export default SearchBar
