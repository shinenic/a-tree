import React from 'react'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import useStore from 'stores/setting'

import BlockTitle from './BlockTitle'

const OptionBoxes = () => {
  const dispatch = useStore((s) => s.dispatch)
  const isFocusMode = useStore((s) => s.isFocusMode)
  const pullMenuEnabled = useStore((s) => s.pullMenuEnabled)

  const handleFocusOptionChange = () => {
    dispatch({ type: 'TOGGLE_FOCUS_MODE' })
  }

  const handleMenuOptionChange = () => {
    dispatch({ type: 'TOGGLE_PULL_MENU' })
  }

  return (
    <>
      <BlockTitle>Options</BlockTitle>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="Pulls Menu" value="yes" />}
            label="Show pull requests list dropdown"
            checked={pullMenuEnabled}
            onChange={handleMenuOptionChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="Focus" value="yes" />}
            label="Focus on single file while code reviewing (experience)"
            checked={isFocusMode}
            onChange={handleFocusOptionChange}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default OptionBoxes
