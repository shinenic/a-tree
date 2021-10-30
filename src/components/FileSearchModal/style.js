import Box from '@material-ui/core/Box'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import { forwardRef } from 'react'

const useStyles = makeStyles(() => ({
  root: {
    margin: '0 8px',
    borderRadius: 3,
    padding: '4px 8px',
    border: '2px solid rgb(33, 130, 172)',

    '&: focus-visible': {
      borderRadius: 3,
      outlineWidth: 0,
      border: '2px solid rgb(33, 130, 172)',
    },
  },
}))

export const FileNameInput = forwardRef((props, ref) => {
  const classes = useStyles()

  return <input ref={ref} className={classes.root} {...props} />
})

export const FileRow = ({ isSelected, ...props }) => {
  const theme = useTheme()

  const colors = {
    dark: {
      backgroundColor: isSelected && '#007fff',
      '&:hover': {
        backgroundColor: '#007fff',
      },
      '& b': {
        color: '#78b6f5',
      },
      color: 'white',
    },
    light: {
      backgroundColor: isSelected && '#f0f7ff',
      color: isSelected && '#007fff',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '& b': {
        color: '#007fff',
      },
    },
  }[theme.palette.type]

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '3px 16px',
        cursor: 'pointer',
        ...colors,
        '&:nth-of-type(1)': {
          marginTop: 10,
        },
      }}
      {...props}
    />
  )
}

export const FileName = (props) => (
  <Box sx={{ fontSize: 15, marginRight: 8 }} {...props} />
)

export const FilePath = (props) => <Box sx={{ fontSize: 12 }} {...props} />
