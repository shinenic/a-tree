import { useTransition, a } from 'react-spring'
import styled from 'styled-components'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
import useClickOutside from 'hooks/useClickOutside'

import Dialog from '@material-ui/core/Dialog'

export default function NativeDialog({
  isOpened,
  onClose,
  children,
  overlayClasses,
  ...rest
}) {
  return (
    <Dialog open={isOpened} onClose={onClose} closeAfterTransition {...rest}>
      {children}
    </Dialog>
  )
}

const AnimatedOverlay = a(styled.div`
  background: #6668;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
`)

export const CustomModal = ({
  isOpened,
  onClose,
  children,
  modalStyle = {},
  overLayStyle = {},
  overlayClasses,
  from = { opacity: 0, transform: 'translateY(-40px)' },
  to = { opacity: 1, transform: 'translateY(0px)' },
  ...rest
}) => {
  const transition = useTransition(isOpened, {
    from,
    enter: to,
    leave: from,
  })
  const modalRef = useClickOutside(onClose)
  useLockBodyScroll(isOpened)

  return transition(
    (style, item) =>
      item && (
        <AnimatedOverlay
          style={{ opacity: style.opacity, ...overLayStyle }}
          onClick={onClose}
        >
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
  )
}
