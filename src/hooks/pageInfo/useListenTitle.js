import { useEffect, useState } from 'react'

/**
 * The meta tag `title` may update after the route changed asynchronously,
 * so the latest value of title must be listened to guarantee the correctness.
 */
const useListenTitle = () => {
  const [title, setTitle] = useState()

  useEffect(() => {
    setTitle(document.querySelector('title')?.getInnerHTML())
  }, [])

  useEffect(() => {
    const callback = () => {
      setTitle(document.querySelector('title')?.getInnerHTML())
    }

    const observer = new MutationObserver(callback)

    observer.observe(document.querySelector('title'), {
      attributes: false,
      childList: true,
      subtree: false,
    })

    return () => observer.disconnect()
  }, [])

  return title
}

export default useListenTitle
