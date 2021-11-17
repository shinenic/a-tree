import { styled as muiStyled } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

export const ErrorContainer = muiStyled(Paper)({
  height: '100%',
  padding: '0 14px 14px 14px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  border: 'none',
  boxShadow: 'none',
})

export const HintContent = (props) => {
  return (
    <Button
      color="primary"
      style={{
        marginTop: 40,
        textTransform: 'none',
      }}
      {...props}
    />
  )
}
