import { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'

import useStore from 'stores/setting'
import { startTokenGuide } from 'utils/tokenGuide'
import tinycolor from 'tinycolor2'

const usePopoverStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor:
      theme.palette.type === 'dark'
        ? tinycolor(theme.palette.background.paper).brighten(8).toHexString()
        : theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: '16px 24px 16px 16px',
  },
}))

const SettingTourGuide = ({ anchorRef }) => {
  const [isOpening, setIsOpening] = useState(false)
  const classes = usePopoverStyles()

  const isTokenHintShowed = useStore((s) => s.isTokenHintShowed)
  const token = useStore((s) => s.token)
  const dispatch = useStore((s) => s.dispatch)
  const isModalOpening = useStore((s) => s.isModalOpening)

  /**
   * Check visibility first time only.
   */
  useEffect(() => {
    if (!isTokenHintShowed && !token && !isModalOpening) {
      setIsOpening(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpening(false)
    dispatch({ type: 'SET_TOKEN_HINT_SHOWED' })
  }

  const goTokenPage = () => {
    setIsOpening(false)
    dispatch({ type: 'SET_TOKEN_HINT_SHOWED' })
    startTokenGuide()
  }

  return (
    <Popover
      open={isOpening}
      anchorEl={anchorRef.current}
      PaperProps={{
        className: classes.paper,
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          By creating a new personal access token, you can
        </Typography>
        <Box sx={{ margin: '4px 0 16px 8px' }}>
          <Typography variant="body1">
            - Sync your pull request files' viewed status
          </Typography>
          <Typography variant="body1">- Get a higher API rate limit</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={goTokenPage}
          style={{ marginRight: 10 }}
        >
          Guide me
        </Button>
        <Button size="small" color="primary" onClick={handleClose}>
          Got it
        </Button>
      </Box>
    </Popover>
  )
}

export default SettingTourGuide
