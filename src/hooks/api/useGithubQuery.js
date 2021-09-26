import { useQuery } from 'react-query'
import { isValidQuery, createGithubQuery } from 'utils/api'
import useStore from 'stores/setting'
import parseLink from 'parse-link-header'

function useGithubQuery(
  queryKeys,
  variables = {},
  useQueryOptions = {},
  getFullPages = false
) {
  const token = useStore((s) => s.token)
  const baseUrl = useStore((s) => s.baseUrl)

  const { url, placeholders = {} } = variables
  const { enabled = true } = useQueryOptions

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
    },
    {
      enabled: enabled && isValidQuery(url, placeholders),
      refetchOnWindowFocus: false,
      ...useQueryOptions,
    }
  )
}

export default useGithubQuery
