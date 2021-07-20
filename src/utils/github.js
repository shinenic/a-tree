import { PAGE_TYPE } from 'constants'
import { isEmpty } from 'lodash'

const { CODE, PULL, COMMIT, PULL_COMMIT } = PAGE_TYPE

/**
 * @returns {object}   pageInfo - contains the below information,
 *                                field will be empty if the data can't be gotten from pathname
 * @returns {string}   pageInfo.pageType - one of `PAGE_TYPE`
 * @returns {string}   pageInfo.owner    - repository owner
 * @returns {string}   pageInfo.repo     - repository name
 * @returns {string}   pageInfo.commit   - commit hash
 * @returns {string}   pageInfo.pull     - pull request's number
 * @returns {string}   pageInfo.branch   - branch name
 * @returns {string[]} pageInfo.filePath - file's path
 */
export const getPageInfo = (pathname = '', defaultInfo = {}) => {
  const [_, owner, repo, decisivePath, ...restPaths] = pathname.split('/')
  const basicInfo = { ...defaultInfo, owner, repo }

  /**
   * {user}/{repo}
   * {user}/{repo}/tree/{branch}/{filePath}
   * {user}/{repo}/blob/{branch}/{filePath}
   */
  if (isEmpty(decisivePath) || ['tree', 'blob'].includes(decisivePath)) {
    return {
      ...basicInfo,
      pageType: CODE,
      ...(!isEmpty(decisivePath) && {
        branch: restPaths[0],
        filePath: restPaths.slice(1),
      }),
    }
  }

  /**
   * {user}/{repo}/pull/{pull}/commits/{commit}
   */
  if (
    decisivePath === 'pull' &&
    restPaths[1] === 'commits' &&
    !isEmpty(restPaths[2])
  ) {
    return {
      ...basicInfo,
      pageType: PULL_COMMIT,
      commit: restPaths[2],
      pull: restPaths[0],
    }
  }

  /**
   * {user}/{repo}/commit/{commit}
   */
  if (decisivePath === 'commit' && !isEmpty(restPaths[0])) {
    return {
      ...basicInfo,
      pageType: COMMIT,
      commit: restPaths[0],
    }
  }

  /**
   * {user}/{repo}/pull/{pull}/*
   */
  if (decisivePath === 'pull' && !isEmpty(restPaths[0])) {
    return {
      ...basicInfo,
      pageType: PULL,
      commit: restPaths[0],
    }
  }

  return basicInfo
}
