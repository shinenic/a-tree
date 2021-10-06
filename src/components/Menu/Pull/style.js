import { styled as muiStyled } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

export const PRNumber = muiStyled('span')(({ theme }) => ({
  marginRight: 6,
  color: theme.palette.text.secondary,
}))

export const LabelsBox = muiStyled(Box)({
  marginTop: 4,

  '& > div:not(:first-of-type)': {
    marginLeft: 6,
  },
})

export const BranchesBox = muiStyled(Box)({
  marginTop: 4,
  display: 'flex',
  alignItems: 'center',

  '& > div:not(:first-of-type)': {
    marginLeft: 8,
  },
})

export const CommitDetail = muiStyled(Box)(({ theme }) => ({
  marginTop: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  color: theme.palette.text.secondary,
  fontSize: 14,

  '& > div:not(:first-of-type)': {
    marginLeft: 8,
  },
}))
