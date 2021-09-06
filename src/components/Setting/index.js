import { useState } from 'react'
import SettingForm from './Form'

import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { AiOutlineSetting } from 'react-icons/ai'
import { makeStyles } from '@material-ui/core/styles'

import Modal from 'components/shared/Modal'

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

const Setting = () => {
  const [isOpened, setIsOpened] = useState(false)
  const classes = useStyles()

  const handleClose = () => setIsOpened(false)

  return (
    <div className={classes.container}>
      <Divider variant="middle" />
      <Button
        className={classes.button}
        color="primary"
        endIcon={<AiOutlineSetting />}
        onClick={() => setIsOpened(true)}
      >
        Setting
      </Button>
      <Modal isOpened={isOpened} onClose={handleClose}>
        <SettingForm />
      </Modal>
    </div>
  )
}

export default Setting
