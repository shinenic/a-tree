import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import { FocusCheckBox, VisibilityCheckBoxes, TokenTextField } from './Fields'

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  formGroup: {
    alignItems: 'start',
    '& > *': {
      marginBottom: '8px',
    },
  },
  label: {
    width: '80px',
  },
}))

export default function SettingForm() {
  const classes = useStyles()

  return (
    <FormControl component="fieldset" className={classes.paper}>
      <FormGroup aria-label="setting" className={classes.formGroup}>
        <VisibilityCheckBoxes />
        <FocusCheckBox classes={{ label: classes.label }} />
        <TokenTextField classes={{ label: classes.label }} />
      </FormGroup>
    </FormControl>
  )
}
