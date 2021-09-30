import { useEffect, useState } from 'react'
import createGithubGqlQuery from 'utils/graphql'
import useStore from 'stores/setting'
import useViewedFilesStore from 'stores/pull'
import { generateReviewCheckListener } from 'utils/pullPage'
import { VIEWER_STATE } from 'constants/github'

function useViewedFiles({ owner, repo, pull } = {}) {
  const [token, baseUrl] = useStore((s) => [s.token, s.baseUrl])
  const clearMap = useViewedFilesStore((s) => s.clearMap)
  const setFileStatus = useViewedFilesStore((s) => s.setFileStatus)

  const [enable, setEnable] = useState(false)

  const reset = () => {
    setEnable(false)
    clearMap()
  }

  useEffect(() => {
    reset()
    if (!token || !pull) return

    const query = async () => {
      try {
        /**
         * @TODO Handle a large number of files
         * @TODO Show hint for this feature (token required)
         */
        const { repository } = await createGithubGqlQuery(
          token,
          `query viewedFiles($owner: String!, $repo: String!, $number: Int!) {
            repository(owner: $owner, name: $repo) {
              pullRequest(number: $number) {
                files(first: 100) {
                  nodes {
                    viewerViewedState
                    path
                  }
                }
              }
            }
          }`,
          {
            owner,
            repo,
            ...(baseUrl && { baseUrl }),
            number: parseInt(pull, 10),
          }
        )
        repository.pullRequest.files.nodes.forEach((node) => {
          setFileStatus(
            node.path,
            node.viewerViewedState === VIEWER_STATE.VIEWED
          )
        })
        setEnable(true)
      } catch {
        reset()
      }
    }

    query()

    return () => reset()
  }, [owner, repo, token, baseUrl, pull])

  useEffect(() => {
    if (!pull || !enable) return

    const unlisten = generateReviewCheckListener(setFileStatus)

    return () => unlisten()
  }, [pull, enable])
}

export default useViewedFiles
