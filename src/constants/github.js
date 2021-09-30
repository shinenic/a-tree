export const GITHUB_PAGE_CONTAINER_ID = 'js-repo-pjax-container'

export const PJAX_ID = {
  CODE: '#repo-content-pjax-container',
  PULL: '#js-repo-pjax-container',
}

/**
 * @note The title can be organized in the below cases
 * 1. {user}/{repo}                 - [Code Page] In the default branch
 * 2. {user}/{repo}: {about}        - [Code Page] In the default branch, but the repo has `About`
 * 3. {repo}/{filePath} at {branch} · {user}/{repo} - [Code Page] Not in the files' root
 * 4. {user}/{repo} at {branch}     - [Code Page] Not in the default branch
 * 5. {tab} · {user}/{repo}         - The `tab` might be `Issues`, `Pull requests`, `Actions`, etc.
 * 6. {otherInfo}                   - `Option`, `Github`, `Your profile`, etc.
 *
 * Note. The `user` and `repo` won't have any `/` or ` `
 *       (might only has `-` except english words)
 *
 * @example for the above cases
 * 1. shinenic/a-tree
 * 2. shinenic/a-tree: something about this repo
 * 3. a-tree/src/background.js at master · shinenic/a-tree
 * 4. shinenic/a-tree at feature/basic-tree-structure
 * 5. Issues · shinenic/a-tree
 * 6. Your profile
 */
export const TITLE_MATCHER = {
  DEFAULT_BRANCH: {
    regex: /^[\w-]+\/[\w-]+$/,
    resolver: (defaultBranch, title) => defaultBranch,
  },
  DEFAULT_BRANCH_WITH_REPO_ABOUT: {
    regex: /^[\w-]+\/[\w-]+:\s/,
    resolver: (defaultBranch, title) => defaultBranch,
  },
  FILE_BROWSING: {
    regex: /\sat\s[\w/-]+\s·\s/,
    resolver: (defaultBranch, title) => title.split('at ')[1].split(' ')[0],
  },
  OTHER_BRANCHES: {
    regex: /^[\w-]+\/[\w-]+\sat\s\w+/,
    resolver: (defaultBranch, title) => title.split(' ')[2],
  },
  OTHER_TABS: {
    regex: /\w+\s·\s[\w-]+\/[\w-]+$/,
    resolver: (defaultBranch, title) => defaultBranch,
  },
  UNKNOWN: {
    regex: /\w+/,
    resolver: (defaultBranch, title) => defaultBranch,
  },
}

export const VIEWER_STATE = {
  UNVIEWED: 'UNVIEWED',
  VIEWED: 'VIEWED',
}
