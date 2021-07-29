import { PAGE_TYPE } from 'constants'
import { TITLE_MATCHER } from 'constants/github'
import { isEmpty } from 'lodash'
import { DEFAULT_PAGE_INFO } from 'constants'

const { CODE, PULL, COMMIT, PULL_COMMIT, PULL_COMMITS, UNKNOWN } = PAGE_TYPE

/**
 * This function only parse pageInfo from `pathname` and `title`,
 * please be aware that it won't check is it a valid repo page,
 * so still need to check the repo info by request API.
 *
 * @return {PageInfo}
 */
export const getPageInfo = (pathname = '', defaultBranch, title) => {
  const [_, first, second, third, ...restPaths] = pathname.split('/')

  if (!first || !second) {
    return DEFAULT_PAGE_INFO
  }

  const branch = matchBranchFromTitle(defaultBranch, title)

  const basicInfo = {
    ...DEFAULT_PAGE_INFO,
    owner: first,
    repo: second,
    branch,
    pageType: UNKNOWN,
  }

  /**
   * {user}/{repo}
   * {user}/{repo}/tree/{branch}/{filePath}
   * {user}/{repo}/blob/{branch}/{filePath}
   */
  if (isEmpty(third) || ['tree', 'blob'].includes(third)) {
    return {
      ...basicInfo,
      pageType: CODE,
      ...(!isEmpty(third) &&
        branch && {
          filePath: restPaths.join('').split(branch)[1],
        }),
    }
  }

  /**
   * {user}/{repo}/pull/{pull}/commits/{commit}
   */
  if (
    third === 'pull' &&
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
  if (third === 'commit' && !isEmpty(restPaths[0])) {
    return {
      ...basicInfo,
      pageType: COMMIT,
      commit: restPaths[0],
    }
  }

  /**
   * {user}/{repo}/pull/{pull}/files/{commit1}..${commit2}
   */
  if (
    third === 'pull' &&
    restPaths[1] === 'files' &&
    restPaths[2]?.includes('..')
  ) {
    return {
      ...basicInfo,
      pageType: PULL_COMMITS,
      pull: restPaths[0],
      commit: restPaths[2].split('..'),
    }
  }

  /**
   * {user}/{repo}/pull/{pull}/*
   */
  if (third === 'pull' && !isEmpty(restPaths[0])) {
    return {
      ...basicInfo,
      pageType: PULL,
      pull: restPaths[0],
    }
  }

  return basicInfo
}

/**
 * @param {*} defaultBranch default branch of the repo (from repo api)
 * @param {*} title page title
 * @returns {string} branch name
 */
export const matchBranchFromTitle = (defaultBranch, title) => {
  if (!defaultBranch || !title) return null

  let result = null

  for (let key in TITLE_MATCHER) {
    if (title.match(TITLE_MATCHER[key].regex)) {
      result = TITLE_MATCHER[key].resolver(defaultBranch, title)
      break
    }
  }

  return result
}
