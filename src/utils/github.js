import { DEFAULT_PAGE_INFO, PAGE_TYPE } from 'constants/base'
import { TITLE_MATCHER } from 'constants/github'
import isReserved from 'github-reserved-names'
import { isEmpty } from 'lodash'

const {
  CODE,
  CODE_COMMIT,
  ISSUES,
  PULLS,
  PULL,
  PULL_COMMIT,
  PULL_COMMITS,
  PULL_FILES,
  OTHERS,
} = PAGE_TYPE

/**
 * This function only parse pageInfo from `pathname` and `title`,
 * please be aware that it won't check is it a valid repo page,
 * so still need to check the repo info by request API.
 *
 * @return {PageInfo}
 */
export const getPageInfo = (pathname = '', defaultBranch, title) => {
  if (!isRepoPathname(pathname)) {
    return DEFAULT_PAGE_INFO
  }

  const [, first, second, third, ...restPaths] = pathname.split('/')

  const branch = matchBranchFromTitle(defaultBranch, title)

  const basicInfo = {
    ...DEFAULT_PAGE_INFO,
    pageType: OTHERS,
    owner: first,
    repo: second,
    branch,
    defaultBranch,
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
          filePath: restPaths.slice(branch.split('/').length).join('/'),
        }),
    }
  }

  /**
   * {user}/{repo}/commit/{commit}
   */
  if (third === 'commit' && !isEmpty(restPaths[0])) {
    return {
      ...basicInfo,
      pageType: CODE_COMMIT,
      commit: restPaths[0],
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
   * {user}/{repo}/pull/{pull}/files/{commit1}..${commit2}
   * @TODO Get both commit and support multi commits
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
   * {user}/{repo}/pull/{pull}/files
   */
  if (third === 'pull' && restPaths[1] === 'files' && !restPaths[2]) {
    return {
      ...basicInfo,
      pageType: PULL_FILES,
      pull: restPaths[0],
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

  /**
   * {user}/{repo}/pulls/*
   */
  if (third === 'pulls') {
    return {
      ...basicInfo,
      pageType: PULLS,
    }
  }

  /**
   * {user}/{repo}/issues/*
   */
  if (third === 'issues') {
    return {
      ...basicInfo,
      pageType: ISSUES,
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

  // eslint-disable-next-line no-restricted-syntax
  for (const key in TITLE_MATCHER) {
    if (title.match(TITLE_MATCHER[key].regex)) {
      result = TITLE_MATCHER[key].resolver(defaultBranch, title)
      break
    }
  }

  return result
}

export const isGithubReservedUsername = (owner) => isReserved.check(owner)

export const isRepoPathname = (pathname) => {
  const githubPathname = pathname || window.location.pathname
  const [, owner, repo] = githubPathname.split('/')

  return !isGithubReservedUsername(owner) && repo
}
