export const CONTAINER_ID = 'a-tree'

export const LOCAL_STORAGE_KEY_PREFIX = '[a-tree] '

export const PAGE_TYPE = {
  CODE: 'CODE',
  PULL: 'PULL',
  COMMIT: 'COMMIT',
  PULL_FILES: 'PULL_FILES',
  PULL_COMMIT: 'PULL_COMMIT',
  PULL_COMMITS: 'PULL_COMMITS',
  UNKNOWN: 'UNKNOWN',
  UNSUPPORTED: 'UNSUPPORTED',
}

export const GLOBAL_MESSAGE_TYPE = {
  ON_HISTORY_UPDATED: 'ON_HISTORY_UPDATED',
}

/** @type {PageInfo} */
export const DEFAULT_PAGE_INFO = {
  pageType: PAGE_TYPE.UNSUPPORTED,
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
