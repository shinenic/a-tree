import { useRef } from 'react'
import Button from '@material-ui/core/Button'
import { AiOutlineSetting } from 'react-icons/ai'
import { makeStyles } from '@material-ui/core/styles'
import usePopperStore from 'stores/popper'

import Modal from 'components/shared/Modal'
import SettingTourGuide from 'components/Guide/Setting'

import SettingForm from './Form'

const useStyles = makeStyles((theme) => ({
  button: {
    height: 'calc(100% - 1px)',
    width: '100%',
    borderRadius: '0',
    color: theme.palette.type === 'dark' ? 'white' : '#505050',
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
}))

export const SettingButton = () => {
  const buttonRef = useRef()
  const toggleSetting = usePopperStore((s) => s.toggleSetting)
  const classes = useStyles()

  const handleOpen = () => toggleSetting(true)

  return (
    <div className={classes.container}>
      <Button
        className={classes.button}
        color="primary"
        endIcon={<AiOutlineSetting />}
        onClick={handleOpen}
        ref={buttonRef}
      />
      <SettingTourGuide anchorRef={buttonRef} />
    </div>
  )
}

export const SettingModal = () => {
  const isSettingOn = usePopperStore((s) => s.isSettingOn)
  const toggleSetting = usePopperStore((s) => s.toggleSetting)

  const handleClose = () => toggleSetting(false)

  return (
    <Modal isOpened={isSettingOn} onClose={handleClose}>
      <SettingForm />
    </Modal>
  )
}
