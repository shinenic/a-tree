import { useQuery } from 'react-query'
import { isValidQuery, createGithubQuery } from 'utils/api'

function useGithubQuery(queryKeys, variables = {}, useQueryOptions = {}) {
  const { url, placeholders = {}, token } = variables
  const { enabled = true } = useQueryOptions

  return useQuery(
    [...queryKeys, { token }],
    async () => {
      const { data } = await createGithubQuery(variables)
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
