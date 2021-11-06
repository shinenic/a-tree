import { useState, useEffect, useRef } from 'react'

import useSettingStore from 'stores/setting'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import tinycolor from 'tinycolor2'
import Popover from '@material-ui/core/Popover'
import { storePhase } from 'utils/tokenGuide'

const NEW_OAUTH_TOKEN_SELECTOR = '[id="new-oauth-token"]'

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

function CreatedTokenTourGuide({ prevUrl }) {
  const classes = usePopoverStyles()
  const anchorRef = useRef()
  const [isOpening, setIsOpening] = useState(false)

  const dispatch = useSettingStore((s) => s.dispatch)

  useEffect(() => {
    anchorRef.current = document.querySelector(NEW_OAUTH_TOKEN_SELECTOR)

    if (anchorRef.current) {
      dispatch({ type: 'UPDATE_TOKEN', payload: anchorRef.current.innerText })
      storePhase()
      setIsOpening(true)
    }
  }, [])

  const handleClose = () => setIsOpening(false)

  return (
    <Popover
      open={isOpening}
      anchorEl={anchorRef.current}
      onClose={handleClose}
      PaperProps={{
        className: classes.paper,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={{ paddingRight: 40, paddingBottom: 18 }}>
        <Typography variant="h6">Token created 🎉</Typography>
        <Typography variant="body1">
          It has been copied in our setting, enjoy it!
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {prevUrl && (
          <Button
            size="small"
            color="primary"
            variant="contained"
            style={{ marginRight: 10, textTransform: 'none', fontSize: 15 }}
            onClick={() => {
              window.location.href = prevUrl
            }}
          >
            Back to previous Page
          </Button>
        )}

        <Button
          size="small"
          color="primary"
          onClick={handleClose}
          style={{ textTransform: 'none', fontSize: 15 }}
        >
          Close
        </Button>
      </Box>
    </Popover>
  )
}

export default CreatedTokenTourGuide
