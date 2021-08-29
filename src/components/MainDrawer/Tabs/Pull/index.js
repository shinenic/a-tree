import { useQueryPull } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'
import usePullFocusMode from 'hooks/setting/usePullFocusMode'

const Pull = ({ owner, pull, repo, pageType }) => {
  const { data, isLoading } = useQueryPull({ owner, pull, repo })
  const onItemClick = usePullFocusMode({
    basePathname: `/${owner}/${repo}/pull/${pull}/files`,
    pageType,
  })

  if (isLoading) return null

  return (
    <Tree
      tree={data}
      treeId={`${owner}-${repo}-${pull}`}
      onItemClick={onItemClick}
      isExpandedAll
    />
  )
}

export default Pull
