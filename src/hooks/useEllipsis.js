import { useEffect, useRef, useState } from 'react'
import { isEllipsisActive } from 'utils/dom'

const useEllipsis = (defaultValue = false) => {
  const ref = useRef()

  const [isEllipsis, setIsEllipsis] = useState(defaultValue)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    const handler = () => {
      setIsEllipsis(isEllipsisActive(element))
    }

    element.addEventListener('mouseenter', handler)

    return () => element.removeEventListener('mouseenter', handler)
  }, [])

  return [ref, isEllipsis]
}

export default useEllipsis
