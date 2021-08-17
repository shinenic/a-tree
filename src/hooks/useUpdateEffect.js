import { useRef, useEffect } from 'react'

const useUpdateEffect = (effect, deps) => {
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    effect()
  }, deps)
}

export default useUpdateEffect
