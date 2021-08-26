import { useQueryPull } from 'hooks/api/useGithubQueries'
import Tree from 'components/Tree'
import usePullFocusMode from 'hooks/setting/usePullFocusMode'
import { PAGE_TYPE } from 'constants'

/**
 * @TODO Link to the correct position of the file
 */
const linkToFileChangeTab = ({ owner, repo, pull }) => {
  const target = document.querySelector(
    `a[href="/${owner}/${repo}/pull/${pull}/files"]`
  )
  console.log(target)
  target.click()
}

const Pull = ({ owner, pull, repo, pageType }) => {
  const { data, isLoading } = useQueryPull({ owner, pull, repo })
  const handleFileSelected = usePullFocusMode()

  const onItemClick = ({ filename }, e) => {
    if (pageType !== PAGE_TYPE.PULL_FILES) {
      linkToFileChangeTab({ owner, pull, repo })
    } else {
      handleFileSelected({ filename }, e)
    }
  }

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

Pull.propTypes = {}

export default Pull
