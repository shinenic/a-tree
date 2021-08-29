import { PJAX_ID, GITHUB_PAGE_CONTAINER_ID } from 'constants/github'
import { CONTAINER_ID } from 'constants/index'

export const getFileLink = ({ owner, repo, type, branch, filePath }) => {
  return `/${owner}/${repo}/${type}/${branch}/${filePath}`
}

export const linkGithubPage = (url, pjaxId = PJAX_ID.CODE) => {
  if (url === window.location?.pathname) return

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('data-pjax', pjaxId)

  const container =
    document.getElementById(GITHUB_PAGE_CONTAINER_ID) ||
    document.getElementById(CONTAINER_ID)

  container?.appendChild(link)

  link.click()
  link.remove()
}
