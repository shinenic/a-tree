import { PJAX_ID } from 'constants/github'

export const getFileLink = ({ owner, repo, type, branch, filePath }) => {
  return `${window.location.origin}/${owner}/${repo}/${type}/${branch}/${filePath}`
}

export const linkGithubPage = (url, pjaxId = PJAX_ID.CODE) => {
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('data-pjax', pjaxId)

  document.getElementById('github-review-enhancer')?.appendChild(link)

  link.click()
  link.remove()
}
