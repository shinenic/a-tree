import { useEffect, useState } from 'react'

const useMousePosition = ({ event = 'mousemove', capture = false }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener(event, setFromEvent, capture)

    return () => {
      window.removeEventListener(event, setFromEvent, capture)
    }
  }, [])

  return position
}

export default useMousePosition
