import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

import useSettingStore from 'stores/setting'
import { FILE_ICON_STYLE } from 'constants'

import BlockTitle from './BlockTitle'

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const FileIconRadios = () => {
  const dispatch = useSettingStore((s) => s.dispatch)
  const fileIconStyle = useSettingStore((s) => s.fileIconStyle)

  const handleChange = (e) => {
    dispatch({ type: 'UPDATE_FILE_ICON_STYLE', payload: e.target.value })
  }

  const formValue = Object.values(FILE_ICON_STYLE).includes(fileIconStyle)
    ? fileIconStyle
    : FILE_ICON_STYLE.DEFAULT

  return (
    <>
      <BlockTitle>File icon style</BlockTitle>
      <Grid container alignItems="center">
        <RadioGroup
          row
          aria-label="position"
          name="position"
          defaultValue="top"
          value={formValue}
          onChange={handleChange}
        >
          {Object.values(FILE_ICON_STYLE).map((style) => (
            <FormControlLabel
              key={style}
              value={style}
              control={<Radio color="primary" />}
              label={toTitleCase(style)}
              labelPlacement="end"
            />
          ))}
        </RadioGroup>
      </Grid>
    </>
  )
}

export default FileIconRadios
