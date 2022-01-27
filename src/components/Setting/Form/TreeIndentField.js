import { useState, useCallback } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { debounce } from 'lodash'
import useSettingStore from 'stores/setting'

import BlockTitle from './BlockTitle'

const TreeIndentField = () => {
  const dispatch = useSettingStore((s) => s.dispatch)
  const treeIndent = useSettingStore((s) => s.treeIndent)

  const [input, setInput] = useState(treeIndent)
  const [errorMessage, setErrorMessage] = useState('')

  const debouncedUpdateIndent = useCallback(
    debounce((newValue) => {
      dispatch({ type: 'UPDATE_TREE_INDENT', payload: newValue })
    }, 1000),
    []
  )

  const handleInputChange = (event) => {
    setErrorMessage('')

    const newValue = event.target.value
    setInput(newValue)

    if (/^\d+$/.test(newValue)) {
      debouncedUpdateIndent(Number(newValue))
    } else {
      setErrorMessage('number must be greater than or equal to 0')
    }
  }

  return (
    <>
      <BlockTitle>Tree indent</BlockTitle>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={7}>
          <TextField
            id="TreeIndentTextField"
            name="TreeIndentTextField"
            label="pixel"
            fullWidth
            value={input}
            onChange={handleInputChange}
            error={Boolean(errorMessage)}
            helperText={errorMessage}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TreeIndentField
