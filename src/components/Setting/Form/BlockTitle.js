import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  typography: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    '&:nth-of-type(1)': {
      marginTop: theme.spacing(0),
    },
  },
}))

const BlockTitle = ({ children, ...rest }) => {
  const classes = useStyles()

  return (
    <Typography variant="h6" className={classes.typography} {...rest}>
      {children}
    </Typography>
  )
}

export default BlockTitle
