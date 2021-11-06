import React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { isEmpty } from 'lodash'
import useSettingStore from 'stores/setting'
import { startTokenGuide } from 'utils/tokenGuide'

import BlockTitle from './BlockTitle'

const TokenField = () => {
  const dispatch = useSettingStore((s) => s.dispatch)
  const token = useSettingStore((s) => s.token)

  const handleInputChange = (event) => {
    dispatch({ type: 'UPDATE_TOKEN', payload: event.target.value })
  }

  const handleClear = () => {
    dispatch({ type: 'UPDATE_TOKEN', payload: '' })
  }

  const handleStart = () => {
    dispatch({ type: 'CLOSE_MODAL' })
    startTokenGuide()
  }

  return (
    <>
      <BlockTitle>Personal access token (private & enterprise)</BlockTitle>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={7}>
          <TextField
            id="TokenTextField"
            name="TokenTextField"
            label="Token"
            fullWidth
            value={token}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={5}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginLeft: 20,
            }}
          >
            <Button
              disabled={!isEmpty(token)}
              onClick={handleStart}
              color="primary"
              variant="contained"
            >
              Create
            </Button>
            <Button
              disabled={isEmpty(token)}
              onClick={handleClear}
              color="secondary"
              variant="outlined"
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default TokenField
