import { useQueryCommit } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'
import usePullFocusMode from 'hooks/setting/usePullFocusMode'
import { PAGE_TYPE } from 'constants'

const Commit = ({ owner, commit, repo }) => {
  const { data, isLoading, error } = useQueryCommit({ owner, commit, repo })
  const onItemClick = usePullFocusMode({
    basePathname: `/${owner}/${repo}/commit/${commit}`,
    pageType: PAGE_TYPE.CODE_COMMIT,
  })

  if (isLoading || error) return null

  return (
    <Tree
      tree={data.files}
      onItemClick={onItemClick}
      treeId={`${owner}-${repo}-${commit}`}
      isExpandedAll
    />
  )
}

export default Commit
