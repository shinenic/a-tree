import { useEffect, useState } from 'react'

function useRequestEnd() {
  const [timestamp, setTimestamp] = useState(null)

  useEffect(() => {
    const handler = () => setTimestamp(Date.now())

    window.addEventListener('pjax:end', handler)

    return () => window.removeEventListener('pjax:end', handler)
  }, [])

  return timestamp
}

export default useRequestEnd
