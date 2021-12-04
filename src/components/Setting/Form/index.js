import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'

import { REPO_URL } from 'constants/base'
import Link from '@material-ui/core/Link'
import GithubIcon from '../GithubIcon'

import TokenField from './TokenField'
import VisibilityCheckBoxes from './VisibilityCheckBoxes'
import FileIconRadios from './FileIconRadios'
import OptionBoxes from './OptionBoxes'
import Hotkeys from './Hotkeys'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    border: 'none',
  },
  link: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    transition: 'opacity 0.1s',
    '&:hover': {
      opacity: 0.8,
    },
  },
  linkTextWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 246,
    height: 32,
    transform: 'rotate(45deg) translate(47px, -88px)',
    paddingLeft: 29,
    lineHeight: '32px',
    transformOrigin: 'left',
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    transition: 'opacity .ˋs',

    '&:hover': {
      opacity: 0.9,
      textDecoration: 'none',
    },
  },
}))

export default function SettingForm() {
  const classes = useStyles()

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Link
        href={REPO_URL}
        target="_blank"
        rel="noopener noference"
        className={classes.linkText}
        classes={{ root: classes.linkTextWrapper }}
        underline="none"
      >
        View docs and source
        <GithubIcon
          size="20"
          color="#fff"
          style={{ position: 'relative', top: '6px', left: '6px' }}
        />
      </Link>
      <VisibilityCheckBoxes />
      <OptionBoxes />
      <Hotkeys />
      <TokenField />
      <FileIconRadios />
    </Paper>
  )
}
