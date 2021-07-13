import { useState, useEffect } from 'react'
import { PAGE_TYPE } from 'constants'
import { getPageInfo } from 'utils/github'
import useListenLocation from 'hooks/useListenLocation'

const DEFAULT_PAGE_INFO = {
  pageType: PAGE_TYPE.UNKNOWN,
  owner: null,
  repo: null,
  commit: null,
  pull: null,
  branch: null,
  filePath: null,
}

const usePageInfo = () => {
  const [pageInfo, setPageInfo] = useState(DEFAULT_PAGE_INFO)
  const { pathname } = useListenLocation()

  useEffect(() => {
    setPageInfo(getPageInfo(pathname, DEFAULT_PAGE_INFO))
  }, [pathname])

  return pageInfo
}

export default usePageInfo
