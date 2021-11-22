import { useQuery } from 'react-query'
import { isValidQuery, createGithubQuery } from 'utils/api'
import useSettingStore from 'stores/setting'
import parseLink from 'parse-link-header'

const DEFAULT_STALE_TIME = Number.MAX_SAFE_INTEGER

const queryFullPageData = async (variables, token, baseUrl) => {
  let fullData = []
  let page = 1
  let link

  do {
    const params = { ...variables.params, page }
    const res = await createGithubQuery({
      ...variables,
      params,
      token,
      baseUrl,
      page,
    })

    fullData = [...fullData, ...res.data]
    link = parseLink(res.headers.link)
    page += 1
  } while (link && link.last)

  return fullData
}

function useGithubQuery(
  queryKeys,
  variables = {},
  useQueryOptions = {},
  getFullPages = false
) {
  const token = useSettingStore((s) => s.token)
  const baseUrl = useSettingStore((s) => s.baseUrl)

  const { url, placeholders = {} } = variables
  const { enabled, ...restOptions } = useQueryOptions

  return useQuery(
    [...queryKeys, { token }],
    async () => {
      if (!getFullPages) {
        const { data } = await createGithubQuery({
          ...variables,
          token,
          baseUrl,
        })

        return data
      }

      return queryFullPageData(variables, token, baseUrl)
    },
    {
      enabled: isValidQuery(url, placeholders) && enabled,
      refetchOnWindowFocus: false,
      staleTime: DEFAULT_STALE_TIME,
      ...restOptions,
    }
  )
}

export default useGithubQuery
