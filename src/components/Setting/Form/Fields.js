import { useState } from 'react'
import { DRAWER_POSITION } from 'constants'

import Checkbox from '@material-ui/core/Checkbox'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'

import { useSettingCtx } from 'components/Setting/Context/Provider'
import { isEmpty } from 'lodash'

const { LEFT, RIGHT } = DRAWER_POSITION

export const FocusCheckBox = (props) => {
  const [{ isFocusMode }, dispatch] = useSettingCtx()

  const handleChange = () => {
    dispatch({ type: 'TOGGLE_FOCUS_MODE' })
  }

  return (
    <FormControlLabel
      label="Focus"
      labelPlacement="start"
      checked={isFocusMode}
      onChange={handleChange}
      control={(
        <Checkbox
          color="primary"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      )}
      {...props}
    />
  )
}

export const PositionSelect = (props) => {
  const [{ position }, dispatch] = useSettingCtx()

  const handleChange = (event) => {
    event.target.value === LEFT
      ? dispatch({ type: 'SET_DRAWER_POSITION_LEFT' })
      : dispatch({ type: 'SET_DRAWER_POSITION_RIGHT' })
  }

  return (
    <FormControlLabel
      label="Position"
      labelPlacement="start"
      control={(
        <Select value={position} onChange={handleChange} displayEmpty>
          <MenuItem value={LEFT}>{LEFT}</MenuItem>
          <MenuItem value={RIGHT}>{RIGHT}</MenuItem>
        </Select>
      )}
      {...props}
    />
  )
}

/**
 * @TODO Verify whether the token is invalid and show hint.
 */
export const TokenTextField = (props) => {
  const [{ token }, dispatch] = useSettingCtx()
  const [input, setInput] = useState(token)

  const handleSave = () => {
    dispatch({ type: 'UPDATE_TOKEN', payload: input })
  }

  const handleClear = () => {
    setInput('')
    dispatch({ type: 'UPDATE_TOKEN', payload: '' })
  }

  const handleInputChange = (event) => {
    setInput(event.target.value)
  }

  return (
    <>
      <FormControlLabel
        label="Token"
        labelPlacement="start"
        control={(
          <TextField
            placeholder="Personal access token"
            value={input}
            onChange={handleInputChange}
          />
        )}
        {...props}
      />
      <div style={{ display: 'flex', margin: '4px 0 0 8px' }}>
        <Button
          variant="outlined"
          color="secondary"
          disabled={isEmpty(input) && isEmpty(token)}
          onClick={handleClear}
          style={{ marginRight: '8px' }}
        >
          Clear Token
        </Button>
        <Button
          variant="outlined"
          color="primary"
          disabled={input === token}
          onClick={handleSave}
          style={{ marginRight: '8px' }}
        >
          Save Token
        </Button>
      </div>
    </>
  )
}
