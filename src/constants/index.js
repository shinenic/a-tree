export const CONTAINER_ID = 'a-tree'

export const LOCAL_STORAGE_KEY_PREFIX = '[a-tree] '

export const SETTING_KEY = `${LOCAL_STORAGE_KEY_PREFIX}setting`

export const DEFAULT_HEADER_HEIGHT = 62

export const GITHUB_NAV_BAR_HEIGHT = 60

export const CODE_PAGE_TYPE = {
  CODE: 'CODE',
  CODE_COMMIT: 'CODE.COMMIT',
}

export const PULL_PAGE_TYPE = {
  PULL: 'PULL',
  PULL_FILES: 'PULL.FILES',
  PULL_COMMIT: 'PULL.COMMIT',
  PULL_COMMITS: 'PULL.COMMITS',
}

/**
 * Defined types for pages which relate to repositories
 */
export const PAGE_TYPE = {
  ...CODE_PAGE_TYPE,
  ...PULL_PAGE_TYPE,
  PULLS: 'PULLS', // pull request list page
  ISSUES: 'ISSUES',
  /**
   * Pages which related to repositories but doesn't belong any of the types above.
   * e.g. {owner}/{repo}/actions, {owner}/{repo}/security
   */
  OTHERS: 'OTHERS',
}

export const PAGES_WITH_BRANCH_TREE = [
  CODE_PAGE_TYPE.CODE,
  PAGE_TYPE.PULLS,
  PAGE_TYPE.ISSUES,
  PAGE_TYPE.OTHERS,
]

export const PAGES_WITH_FULL_PULL_TREE = [
  PULL_PAGE_TYPE.PULL,
  PULL_PAGE_TYPE.PULL_FILES,
]

/** @type {PageInfo} */
export const DEFAULT_PAGE_INFO = {
  pageType: null,
  owner: null,
  repo: null,
  commit: null,
  pull: null,
  branch: null,
  filePath: null,
  defaultBranch: null,
}

export const DRAWER_POSITION = {
  LEFT: 'Left',
  RIGHT: 'Right',
}

export const FILE_ICON_STYLE = {
  DEFAULT: 'default',
  VARIANT: 'variant',
  COLORFUL: 'colorful',
}

export const ERROR_MESSAGE = {
  NOT_FOUND_PAGE: 'NOT_FOUND_PAGE',
  TOKEN_INVALID: 'TOKEN_INVALID',
  NO_PERMISSION: 'NO_PERMISSION',
  NOT_SUPPORTED_PAGE: 'NOT_SUPPORTED_PAGE',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  UNKNOWN: 'UNKNOWN',
}

export const CONTEXT_ITEM = {
  PATHNAME: 'PATHNAME',
  OPEN_LINK_IN_NEW_TAB: 'OPEN_LINK_IN_NEW_TAB',
  DOWNLOAD_FILE: 'DOWNLOAD_FILE',
  COPY_PATHNAME: 'COPY_PATHNAME',
  COPY_FILE_CONTENT: 'COPY_FILE_CONTENT',
  MARK_ALL_FILES_AS_VIEWED: 'MARK_ALL_FILES_AS_VIEWED',
  MARK_ALL_FILES_AS_NOT_VIEWED: 'MARK_ALL_FILES_AS_NOT_VIEWED',
  EXPAND_ALL_VIEWED_FILES: 'EXPAND_ALL_VIEWED_FILES',
  COLLAPSE_ALL_VIEWED_FILES: 'COLLAPSE_ALL_VIEWED_FILES',
}

export const isLocalMode = process.env.LOCAL_MODE === 'true'

export const localAPIPort = process.env.API_PORT

export const REPO_URL = 'https://github.com/shinenic/a-tree'

export const isGithubHost = window.location.host === 'github.com'

export const IS_MAC = navigator.platform.toUpperCase().indexOf('MAC') >= 0

export const MODIFIER_KEY_PROPERTY = IS_MAC ? 'metaKey' : 'ctrlKey'

export const HOTKEY_ADORNMENT = IS_MAC ? 'Cmd ⌘ + ' : 'Ctrl + '
