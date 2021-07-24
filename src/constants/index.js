export const CONTAINER_ID = 'github-review-enhancer'

export const PAGE_TYPE = {
  CODE: 'CODE',
  PULL: 'PULL',
  COMMIT: 'COMMIT',
  PULL_COMMIT: 'PULL_COMMIT',
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
}
