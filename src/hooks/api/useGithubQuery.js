import { useQuery } from 'react-query'
import { isValidQuery, createGithubQuery } from 'utils/api'
import { useSettingStateCtx } from 'components/Setting/Context/Provider'

function useGithubQuery(queryKeys, variables = {}, useQueryOptions = {}) {
  const { token, baseUrl } = useSettingStateCtx()
  const { url, placeholders = {} } = variables
  const { enabled = true } = useQueryOptions

  return useQuery(
    [...queryKeys, { token }],
    async () => {
      const { data } = await createGithubQuery({ ...variables, token, baseUrl })
      return data
    },
    {
      enabled: enabled && isValidQuery(url, placeholders),
      refetchOnWindowFocus: false,
      ...useQueryOptions,
    }
  )
}

export default useGithubQuery
