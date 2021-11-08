import React from 'react'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import useSettingStore from 'stores/setting'

import BlockTitle from './BlockTitle'

const OptionBoxes = () => {
  const dispatch = useSettingStore((s) => s.dispatch)
  const isFocusMode = useSettingStore((s) => s.isFocusMode)

  const handleFocusOptionChange = () => {
    dispatch({ type: 'TOGGLE_FOCUS_MODE' })
  }

  return (
    <>
      <BlockTitle>Options</BlockTitle>
      <Grid container alignItems="center">
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
