import ReactDOM from 'react-dom'
import { useTransition, a, animated, config } from 'react-spring'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
import useClickOutside from 'hooks/useClickOutside'
import Box from '@material-ui/core/Box'

import Dialog from '@material-ui/core/Dialog'

export default function NativeDialog({ isOpened, onClose, children, overlayClasses, ...rest }) {
  return (
    <Dialog open={isOpened} onClose={onClose} closeAfterTransition {...rest}>
      {children}
    </Dialog>
  )
}

const AnimatedOverlay = animated((props) => (
  <Box
    sx={{
      background: '#6668',
      position: 'fixed',
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999
    }}
    {...props}
  />
))

export const CustomModal = ({
  isOpened,
  onClose,
  children,
  modalStyle = {},
  overLayStyle = {},
  overlayClasses,
  from = { opacity: 0, transform: 'translateY(-15px)' },
  to = { opacity: 1, transform: 'translateY(0px)' },
  ...rest
}) => {
  const transition = useTransition(isOpened, {
    from,
    enter: to,
    leave: from,
    config: config.stiff
  })
  const modalRef = useClickOutside(onClose, isOpened)
  useLockBodyScroll(isOpened)

  return ReactDOM.createPortal(
    transition(
      (style, item) =>
        item && (
          <AnimatedOverlay style={{ opacity: style.opacity, ...overLayStyle }} onClick={onClose}>
            <a.div
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
              {...rest}
              style={{ ...style, ...modalStyle }}
            >
              {children}
            </a.div>
          </AnimatedOverlay>
        )
    ),
    document.querySelector('body')
  )
}
