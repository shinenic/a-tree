import { useQueryPull } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'
import useLinkPullFile from 'hooks/setting/useLinkPullFile'
import FileSearchModal from 'components/FileSearchModal'
import Loading from '../Loading'

const Pull = ({ owner, pull, repo, pageType }) => {
  const { data, isLoading, error } = useQueryPull({ owner, pull, repo })
  const onItemClick = useLinkPullFile({
    basePathname: `/${owner}/${repo}/pull/${pull}/files`,
    pageType,
  })

  if (error) return null

  return (
    <>
      <FileSearchModal
        files={data}
        isLoading={isLoading}
        selectCallback={onItemClick}
      />
      {isLoading ? (
        <Loading isExpandedAll />
      ) : (
        <Tree
          tree={data}
          treeId={`${owner}-${repo}-${pull}`}
          onItemClick={onItemClick}
          isExpandedAll
        />
      )}
    </>
  )
}

export default Pull
