import { useEffect, useState } from 'react'
import { listenPjaxEnd } from 'utils/pjax'

function useRequestEnd() {
  const [timestamp, setTimestamp] = useState(null)

  useEffect(() => {
    const handler = () => setTimestamp(Date.now())

    const unlisten = listenPjaxEnd(handler)

    return () => unlisten()
  }, [])

  return timestamp
}

export default useRequestEnd
