import { loadPjaxPage } from 'utils/pjax'

export const getFileLink = ({ owner, repo, type, branch, filePath }) => {
  return `/${owner}/${repo}/${type}/${branch}/${filePath}`
}

export const getRepoLink = ({ owner, repo }) => {
  return `/${owner}/${repo}`
}

export const getBranchLink = ({ owner, repo, branch }) =>
  `/${owner}/${repo}/tree/${branch}/`

export const getOwnerLink = ({ owner }) => `/${owner}`

export const linkGithubPage = (url) => {
  if (url === window.location?.pathname) return

  loadPjaxPage(`${window.location.origin}${url}`)
}
