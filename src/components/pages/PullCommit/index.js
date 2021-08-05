import { useQueryCommit } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'
import usePullFocusMode from 'hooks/setting/usePullFocusMode'

const PullCommit = ({ owner, commit, repo }) => {
  const { data, isLoading, error } = useQueryCommit({ owner, commit, repo })
  const onItemClick = usePullFocusMode()

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

PullCommit.propTypes = {}

export default PullCommit
