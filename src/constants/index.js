export const CONTAINER_ID = 'a-tree'

export const LOCAL_STORAGE_KEY_PREFIX = '[a-tree] '

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
  PULLS: 'PULLS',
  ISSUES: 'ISSUES',
  /**
   * Pages which related to repositories but doesn't belong any of the types above.
   * e.g. {owner}/{repo}/actions, {owner}/{repo}/security
   */
  OTHERS: 'OTHERS',
}

export const GLOBAL_MESSAGE_TYPE = {
  ON_HISTORY_UPDATED: 'ON_HISTORY_UPDATED',
  ON_CONTEXT_MENU_CLICKED: 'ON_CONTEXT_MENU_CLICKED',
}

export const CONTEXT_MENU_ITEM_ID = {
  ENABLE_EXTENSION: 'enable-extension',
  DISABLE_EXTENSION: 'disable-extension',
}

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

export const ERROR_MESSAGE = {
  NOT_FOUND_PAGE: 'NOT_FOUND_PAGE',
  TOKEN_INVALID: 'TOKEN_INVALID',
  NO_PERMISSION: 'NO_PERMISSION',
  NOT_SUPPORTED_PAGE: 'NOT_SUPPORTED_PAGE',
  UNKNOWN: 'UNKNOWN',
}

export const isLocalMode = process.env.LOCAL_MODE === 'true'

export const localAPIPort = process.env.API_PORT
