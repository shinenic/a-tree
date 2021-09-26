import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { AiOutlineSetting } from 'react-icons/ai'
import { makeStyles } from '@material-ui/core/styles'

import Modal from 'components/shared/Modal'
import useStore from 'stores/setting'
import SettingForm from './Form'

const useStyles = makeStyles(() => ({
  button: {
    height: 'calc(100% - 1px)',
    width: '100%',
    borderRadius: '0',
  },
  container: {
    width: '100%',
    height: '100%',
  },
}))

export const SettingButton = () => {
  const dispatch = useStore((s) => s.dispatch)
  const classes = useStyles()

  const handleOpen = () => dispatch({ type: 'OPEN_MODAL' })

  return (
    <div className={classes.container}>
      <Divider variant="middle" />
      <Button
        className={classes.button}
        color="primary"
        endIcon={<AiOutlineSetting />}
        onClick={handleOpen}
      >
        Setting
      </Button>
    </div>
  )
}

export const SettingModal = () => {
  const dispatch = useStore((s) => s.dispatch)
  const isModalOpening = useStore((s) => s.isModalOpening)

  const handleClose = () => dispatch({ type: 'CLOSE_MODAL' })

  return (
    <Modal isOpened={isModalOpening} onClose={handleClose}>
      <SettingForm />
    </Modal>
  )
}
