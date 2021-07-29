import { PJAX_LINK_ID } from 'constants/github'

export const getFileLink = ({ owner, repo, type, branch, filePath }) => {
  return `${window.location.origin}/${owner}/${repo}/${type}/${branch}/${filePath}`
}

export const linkGithubPage = (url, pjaxId = PJAX_LINK_ID) => {
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('data-pjax', pjaxId)

  document.getElementById('github-review-enhancer')?.appendChild(link)

  link.click()
  link.remove()
}
