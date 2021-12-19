import React from 'react'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import useSettingStore from 'stores/setting'
import Chip from '@material-ui/core/Chip'

import BlockTitle from './BlockTitle'

const OptionBoxes = () => {
  const dispatch = useSettingStore((s) => s.dispatch)
  const isFocusMode = useSettingStore((s) => s.isFocusMode)
  const disableCommitSwitchHotkey = useSettingStore((s) => s.disableCommitSwitchHotkey)

  const handleFocusOptionChange = () => {
    dispatch({ type: 'TOGGLE_FOCUS_MODE' })
  }

  const handleToggleCommitSwitch = () => {
    dispatch({ type: 'TOGGLE_COMMIT_SWITCH_HOTKEY' })
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
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="CommitSwitchHotkey" value="yes" />}
            label={
              <>
                Enable switch commit in one pull via
                <Chip label="shift + ⬅" size="small" style={{ margin: '0 8px' }} />
                <Chip label="shift + ➡" size="small" />
              </>
            }
            checked={!disableCommitSwitchHotkey}
            onChange={handleToggleCommitSwitch}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default OptionBoxes
