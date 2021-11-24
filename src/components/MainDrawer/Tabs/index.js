import Tree from 'components/Tree'
import LargeTree from 'components/Tree/LargeTree'

import { PULL_PAGE_TYPE, CODE_PAGE_TYPE } from 'constants'
import useTreeItemClick from 'hooks/tree/useTreeItemClick'
import useGetNodeHref from 'hooks/tree/useGetNodeHref'
import useQueryTree from 'hooks/tree/useQueryTree'
import useViewedFiles from 'hooks/api/useViewedFiles'
import useSettingStore from 'stores/setting'
import Loading from './Loading'

const EXPANDED_TREE_TYPES = [
  CODE_PAGE_TYPE.CODE_COMMIT,
  ...Object.values(PULL_PAGE_TYPE),
]

const TreeTab = ({ ...pageInfo }) => {
  const drawerPinned = useSettingStore((s) => s.drawerPinned)
  const { pageType, owner, repo, pull, filePath } = pageInfo

  const { files, isLoading, error, isLargeRepoTree } = useQueryTree(
    pageInfo,
    drawerPinned
  )
  const onItemClick = useTreeItemClick(pageInfo)
  const getNodeHref = useGetNodeHref(pageInfo)

  useViewedFiles({ owner, pull, repo })

  const isExpandedAll = EXPANDED_TREE_TYPES.includes(pageType)

  if (isLargeRepoTree) {
    return (
      <LargeTree
        onItemClick={onItemClick}
        currentFilePath={filePath}
        {...pageInfo}
      />
    )
  }

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
      getNodeHref={getNodeHref}
    />
  )
}

export default TreeTab
