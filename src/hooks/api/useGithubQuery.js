import { useQuery } from 'react-query'
import { isValidQuery, createGithubQuery } from 'utils/api'
import useSettingStore from 'stores/setting'

const DEFAULT_STALE_TIME = Number.MAX_SAFE_INTEGER

const queryFullPageData = async (variables, token, baseUrl) => {
  const perPage = variables.params.per_page

  let fullData = []
  let page = 0
  let res

  do {
    page += 1

    const params = { ...variables.params, page }
    try {
      res = await createGithubQuery({
        ...variables,
        params,
        token,
        baseUrl,
        page,
      })
    } catch {
      res = null
    }

    if (!res?.data || res.data.length === 0) break

    fullData = [...fullData, ...res.data]

    if (res.data.length < perPage) break
  } while (res?.data?.length === perPage)

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
