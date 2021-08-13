import { useQuery, useInfiniteQuery } from 'react-query'
import { isValidQuery, createGithubQuery } from 'utils/api'

function useGithubQuery(queryKeys, variables = {}, useQueryOptions = {}) {
  const { url, placeholders = {}, token } = variables
  const { enabled = true } = useQueryOptions

  return useQuery(
    [...queryKeys, { token }],
    async () => {
      const res = await createGithubQuery(variables)
      console.log(res.headers.link)
      return res.data
    },
    {
      enabled: enabled && isValidQuery(url, placeholders),
      refetchOnWindowFocus: false,
      ...useQueryOptions,
    }
  )
}

const getPageCursor = (response) => {
  const result = { prevCursor: null, nextCursor: null }
  const link = response?.headers?.link

  if (!link) return result

  const linkPairs = link.split(',').map((str) => str.split(';'))

  linkPairs.forEach(([url, rel]) => {
    if (rel.includes('prev')) {
      result.prevCursor = url?.match(/(&|\?)page=(\d)/)?.[2]
    } else if (rel.includes('next')) {
      result.nextCursor = url?.match(/(&|\?)page=(\d)/)?.[2]
    }
  })

  return result
}

export function useInfiniteGithubQuery(
  queryKeys,
  variables = {},
  useQueryOptions = {}
) {
  const {
    url,
    placeholders = {},
    token = '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',
  } = variables
  const { enabled = true } = useQueryOptions

  return useInfiniteQuery(
    [...queryKeys, { token }],
    async ({ pageParam = 1 }) => {
      const res = await createGithubQuery({
        ...variables,
        params: { ...variables.params, page: pageParam },
      })
      // return {
      //   data: res.data,
      //   ...getPageCursor(res),
      // }
      return res.data
    },
    {
      // getNextPageParam: (lastPage, allPages) => {
      //   console.log('nextpage', lastPage, getPageCursor(lastPage).nextCursor)
      //   return getPageCursor(lastPage).nextCursor
      // },
      // getPreviousPageParam: (firstPage, allPages) => {
      //   console.log('previous', getPageCursor(firstPage).prevCursor)
      //   return getPageCursor(firstPage).prevCursor
      // },
      // select: (res) => ({
      //   pages: data.pages.map(({ data }) => data),
      //   pageParams: res.pageParams,
      // }),
      enabled: enabled && isValidQuery(url, placeholders),
      refetchOnWindowFocus: false,
      ...useQueryOptions,
    }
  )
}

// const {
//   fetchNextPage,
//   fetchPreviousPage,
//   hasNextPage,
//   hasPreviousPage,
//   isFetchingNextPage,
//   isFetchingPreviousPage,
//   ...result
// } =

export default useGithubQuery
