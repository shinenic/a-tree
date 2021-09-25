import { useQueryCommit } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'
import useLinkPullFile from 'hooks/setting/useLinkPullFile'
import { PAGE_TYPE } from 'constants'
import FileSearchModal from 'components/FileSearchModal'
import Loading from '../Loading'

const Commit = ({ owner, commit, repo }) => {
  const { data, isLoading, error } = useQueryCommit({ owner, commit, repo })
  const onItemClick = useLinkPullFile({
    basePathname: `/${owner}/${repo}/commit/${commit}`,
    pageType: PAGE_TYPE.CODE_COMMIT,
  })

  if (error) return null

  return (
    <>
      <FileSearchModal
        files={data?.files}
        isLoading={isLoading}
        selectCallback={onItemClick}
      />
      {isLoading ? (
        <Loading isExpandedAll />
      ) : (
        <Tree
          tree={data.files}
          onItemClick={onItemClick}
          treeId={`${owner}-${repo}-${commit}`}
          isExpandedAll
        />
      )}
    </>
  )
}

export default Commit
