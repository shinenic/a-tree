import { useState } from 'react'
import { DRAWER_POSITION, PAGE_TYPE } from 'constants'

import Checkbox from '@material-ui/core/Checkbox'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'

import { useSettingCtx } from 'components/Setting/Context/Provider'
import { isEmpty, intersection } from 'lodash'

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
      control={
        <Checkbox
          color="primary"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      }
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
      control={
        <Select value={position} onChange={handleChange} displayEmpty>
          <MenuItem value={LEFT}>{LEFT}</MenuItem>
          <MenuItem value={RIGHT}>{RIGHT}</MenuItem>
        </Select>
      }
      {...props}
    />
  )
}

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
        control={
          <TextField
            placeholder="Personal access token"
            value={input}
            onChange={handleInputChange}
          />
        }
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

/**
 * @type {({ disabled: boolean, text: string, values?: string[], checked?: boolean })[]}
 */
const VISIBLE_PAGE_TYPE_OPTIONS = [
  { text: 'Code', disabled: true, checked: true },
  { text: 'Pull', disabled: true, checked: true },
  { text: 'Issues', values: [PAGE_TYPE.ISSUES] },
  { text: 'Others (Discussions, Wiki, ...)', values: [PAGE_TYPE.OTHERS] },
]

export const VisibilityCheckBoxes = () => {
  const [{ disablePageTypeList = [] }, dispatch] = useSettingCtx()

  return (
    <>
      {VISIBLE_PAGE_TYPE_OPTIONS.map(({ text, disabled, checked, values }) => {
        const isChecked =
          checked || isEmpty(intersection(values, disablePageTypeList))

        const handleChange = () => {
          values.forEach((pageType) => {
            if (disablePageTypeList?.includes(pageType)) {
              dispatch({
                type: 'UPDATE_DISABLE_PAGE_TYPE_LIST',
                payload: disablePageTypeList.filter(
                  (type) => type !== pageType
                ),
              })
            } else {
              dispatch({
                type: 'UPDATE_DISABLE_PAGE_TYPE_LIST',
                payload: [...disablePageTypeList, pageType],
              })
            }
          })
        }

        return (
          <FormControlLabel
            key={text}
            disabled={disabled}
            control={
              <Checkbox
                name={text}
                checked={isChecked}
                onChange={handleChange}
              />
            }
            label={text}
          />
        )
      })}
    </>
  )
}
