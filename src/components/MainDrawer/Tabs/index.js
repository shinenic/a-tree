import Tree from 'components/Tree'
import { PULL_PAGE_TYPE, CODE_PAGE_TYPE } from 'constants'
import useTreeItemClick from 'hooks/tree/useTreeItemClick'
import useQueryTree from 'hooks/tree/useQueryTree'
import useViewedFiles from 'hooks/api/useViewedFiles'
import useStore from 'stores/setting'
import Loading from './Loading'

const EXPANDED_TREE_TYPES = [
  CODE_PAGE_TYPE.CODE_COMMIT,
  ...Object.values(PULL_PAGE_TYPE),
]

const TreeTab = ({ ...pageInfo }) => {
  const drawerPinned = useStore((s) => s.drawerPinned)
  const { pageType, owner, repo, pull, filePath } = pageInfo

  const { files, isLoading, error } = useQueryTree(pageInfo, drawerPinned)
  const onItemClick = useTreeItemClick(pageInfo)

  useViewedFiles({ owner, pull, repo })

  const isExpandedAll = EXPANDED_TREE_TYPES.includes(pageType)

  if (error) return null

  if (isLoading || !files) {
    return <Loading isExpandedAll={isExpandedAll} />
  }

  return (
    <Tree
      tree={files}
      onItemClick={onItemClick}
      isExpandedAll={isExpandedAll}
      currentFilePath={filePath}
    />
  )
}

export default TreeTab
