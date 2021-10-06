import { useState, useCallback } from 'react'

const useSwitch = (initialValue = false) => {
  const [isOn, setIsOn] = useState(initialValue)

  const on = useCallback(() => setIsOn(true), [])
  const off = useCallback(() => setIsOn(false), [])
  const toggle = useCallback(() => setIsOn((prev) => !prev), [])

  const result = [isOn, on, off, toggle]

  /* eslint-disable */
  result.isOn = result[0]
  result.on = result[1]
  result.off = result[2]
  result.toggle = result[3]
  /* eslint-enable */

  return result
}

export default useSwitch
