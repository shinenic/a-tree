import { useQuerySingleLevelFiles } from 'hooks/api/useGithubQueries'
import { useState } from 'react'
import { useQueryClient } from 'react-query'

const useQueryLargeTree = ({ owner, repo, branch } = {}) => {
  const queryClient = useQueryClient()

  const [sha, queryBySha] = useState(null)

  // Store the response of each sha as one query cache data
  const files = queryClient.getQueryData([
    'large-tree',
    { owner, repo, branch },
  ])

  const { isLoading, error } = useQuerySingleLevelFiles(
    { owner, repo, sha: sha || branch },
    {
      onSuccess: (singleLevelFiles) => {
        queryClient.setQueryData(
          ['large-tree', { owner, repo, branch }],
          (prevFiles = []) => {
            const { sha: queriedSha, tree } = singleLevelFiles
            const basedFile = prevFiles.find((file) => file.sha === queriedSha)
            const basedPath = basedFile ? `${basedFile.path}/` : ''

            return [
              ...prevFiles,
              ...tree.map((file) => ({ ...file, path: basedPath + file.path })),
            ]
          }
        )
      },
      enabled: Boolean(owner && repo && branch),
    }
  )

  return {
    files: files || [],
    queryBySha,
    isLoading,
    error,
  }
}

export default useQueryLargeTree
