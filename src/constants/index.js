export const CONTAINER_ID = 'github-review-enhancer'

export const LOCAL_STORAGE_KEY_PREFIX = '[github-review-enhancer] '

export const PAGE_TYPE = {
  CODE: {
    DEFAULT: 'CODE',
    COMMIT: 'CODE.COMMIT',
  },
  // PULL: 'PULL',
  // COMMIT: 'COMMIT',
  PULL: {
    DEFAULT: 'PULL',
    FILES: 'PULL.FILES',
    COMMIT: 'PULL.COMMIT',
    COMMITS: 'PULL.COMMITS',
  },
  ISSUES: 'ISSUES',
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
  NOT_FOUND_PAGE: 'NOT_FOUND_PAGE', // NOT_FOUND_REPO
  TOKEN_INVALID: 'TOKEN_INVALID',
  NO_PERMISSION: 'NO_PERMISSION',
  RESERVED_USER_NAME: 'RESERVED_USER_NAME',
  NOT_SUPPORTED_PAGE: 'NOT_SUPPORTED_PAGE',
  UNKNOWN: 'UNKNOWN',
}
