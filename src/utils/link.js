import { PJAX_ID, GITHUB_PAGE_CONTAINER_ID } from 'constants/github'
import { CONTAINER_ID } from 'constants/index'

export const getFileLink = ({ owner, repo, type, branch, filePath }) => {
  return `/${owner}/${repo}/${type}/${branch}/${filePath}`
}

const generatePjaxLink = () => {
  let isPjaxStart = false

  const handler = () => {
    isPjaxStart = false
  }

  window.addEventListener('pjax:end', handler)

  return (url, pjaxId = PJAX_ID.CODE) => {
    if (url === window.location?.pathname || isPjaxStart) return

    try {
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('data-pjax', pjaxId)

      const container =
        document.getElementById(GITHUB_PAGE_CONTAINER_ID) ||
        document.getElementById(CONTAINER_ID)

      container?.appendChild(link)

      link.click()
      link.remove()

      isPjaxStart = true
    } catch (error) {
      console.error(error)
    }
  }
}

export const linkGithubPage = generatePjaxLink()
