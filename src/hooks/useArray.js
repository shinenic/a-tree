import { useState, useCallback } from 'react'
import { without } from 'lodash'

const useArray = (initialValue = []) => {
  const [arr, setArr] = useState(initialValue)

  const addElement = (ele) => {
    if (arr.includes(ele)) return

    setArr((prev) => [...prev, ele])
  }

  const removeElement = (ele) => {
    if (!arr.includes(ele)) return

    setArr((prev) => without(prev, ele))
  }

  const clearArr = useCallback(() => setArr([]), [])

  return [arr, addElement, removeElement, setArr, clearArr]
}

export default useArray
