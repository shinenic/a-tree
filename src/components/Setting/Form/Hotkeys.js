import Grid from '@material-ui/core/Grid'
import useSettingStore from 'stores/setting'
import { HOTKEY_ADORNMENT } from 'constants/base'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

import BlockTitle from './BlockTitle'

const ALPHABET = [...'abcdefghijklmnopqrstuvwxyz', ...'1234567890']

const HOTKEY_OPTIONS = ALPHABET.map((key) => ({
  value: key,
  text: `${HOTKEY_ADORNMENT}${key.toUpperCase()}`,
}))

const useInputStyles = makeStyles({
  root: {
    width: 100,
  },
})

const Hotkeys = () => {
  const inputClasses = useInputStyles()

  const dispatch = useSettingStore((s) => s.dispatch)
  const fileSearchHotkey = useSettingStore((s) => s.fileSearchHotkey)

  const onChange = (event) => {
    dispatch({ type: 'UPDATE_FILE_SEARCH_HOTKEY', payload: event.target.value })
  }

  return (
    <>
      <BlockTitle>Hotkeys</BlockTitle>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={3}>
          <Select
            onChange={onChange}
            value={fileSearchHotkey}
            inputProps={{ classes: inputClasses }}
          >
            {HOTKEY_OPTIONS.map(({ value, text }) => (
              <MenuItem value={value} key={value}>
                {text}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body1">Open file search modal</Typography>
        </Grid>
      </Grid>
      {fileSearchHotkey === 'k' && (
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: 8 }}
        >
          ⚠ Warning: <Chip label={`${HOTKEY_ADORNMENT}K`} size="small" /> will
          block the native github command palette
        </Typography>
      )}
    </>
  )
}

export default Hotkeys
