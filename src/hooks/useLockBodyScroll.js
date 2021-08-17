import { useLayoutEffect } from 'react'

const useLockBodyScroll = (locked) => {
  useLayoutEffect(() => {
    if (!locked) return

    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [locked])
}

export default useLockBodyScroll
