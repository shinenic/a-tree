import Tree from 'components/Tree'
import { PAGE_TYPE } from 'constants'
import useTreeItemClick from 'hooks/tree/useTreeItemClick'
import useQueryTree from 'hooks/tree/useQueryTree'
import useViewedFiles from 'hooks/api/useViewedFiles'
import useStore from 'stores/setting'
import Loading from './Loading'

const EXPANDED_TREE_TYPES = [
  PAGE_TYPE.PULL,
  PAGE_TYPE.PULL_FILES,
  PAGE_TYPE.PULL_COMMIT,
  PAGE_TYPE.PULL_COMMITS,
  PAGE_TYPE.CODE_COMMIT,
]

const TreeTab = ({ ...pageInfo }) => {
  const drawerPinned = useStore((s) => s.drawerPinned)
  const { pageType, owner, repo, commit, pull, branch, filePath } = pageInfo

  const { data, isLoading, error } = useQueryTree(pageInfo, drawerPinned)
  const onItemClick = useTreeItemClick(pageInfo)

  useViewedFiles({ owner, pull, repo })

  if (error) return null

  if (isLoading || !data) {
    return <Loading isExpandedAll={EXPANDED_TREE_TYPES.includes(pageType)} />
  }

  return (
    <Tree
      tree={data?.files || data?.tree || data}
      onItemClick={onItemClick}
      isExpandedAll={EXPANDED_TREE_TYPES.includes(pageType)}
      currentFilePath={filePath}
    />
  )
}

export default TreeTab
