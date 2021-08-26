import { isEmpty } from 'lodash'

/**
 * DOM structure
 *
 * <div id="files"> // may have multiple children under the root
 *   <div class="js-diff-progressive-container">
 *     <div id="diff-${hash}">
 *       ...
 *       <a title="{filePath}" href="#diff-${hash}">{filePath}</a>
 *       ...
 *     </div>
 *   </div>
 *   <div class="js-diff-progressive-container">...</div>
 * </div>
 */
const getFileNodes = () => {
  const diffContainer = document.getElementById('files')
  if (!diffContainer) return null

  return diffContainer.querySelectorAll(
    'a[href^="#diff"]:not([title*="Expand"])'
  )
}

/**
 * Iterate all of the files' <a> tag,
 * return matched `filePath` html node if `filePath` is assigned
 *
 * @TODO Handle large pull request with very long file changes
 *
 * @note The outerText of file link will be the file path,
 * but it will be `{oldFilePath} → {filePath}` when the file renamed
 *
 * @param {object}  option
 * @param {string}  option.filePath full file path, eg. `src/hooks/test.js`
 * @param {boolean} option.focusFile if true, the nodes will be hidden except the node matches `filePath`
 * @param {boolean} option.showAllFiles if true, all of the nodes will be visible
 * @returns {HTMLElement}
 */
const loopFileNodes = ({ filePath, focusFile, showAllFiles } = {}) => {
  if (focusFile && showAllFiles) {
    throw new Error(`"focusFile" and "showAllFiles" can't be used together`)
  }

  if (focusFile && !filePath) {
    throw new Error(`"focusFile" and "filePath" should be used together`)
  }

  const fileLinks = getFileNodes()
  if (isEmpty(fileLinks)) return null

  let target = null

  fileLinks.forEach(({ hash, outerText }) => {
    if (outerText.includes(filePath)) {
      target = document.getElementById(hash.substr(1))

      if (focusFile || showAllFiles) {
        document.getElementById(hash.substr(1)).style.display = 'block'
      }
    } else {
      if (showAllFiles) {
        document.getElementById(hash.substr(1)).style.display = 'block'
      } else if (focusFile) {
        document.getElementById(hash.substr(1)).style.display = 'none'
      }
    }
  })

  return target
}

export const focusFile = (filePath, { scrollToNav = true } = {}) => {
  loopFileNodes({ filePath, focusFile: true })

  if (scrollToNav) {
    document.querySelector('nav[class*="tabnav-tabs"]')?.scrollIntoView()
  }

  return true
}

const GITHUB_NAV_BAR_HEIGHT = 60

const scrollTo = (target, offsetY = GITHUB_NAV_BAR_HEIGHT) => {
  if (!target) return

  const y = target.getBoundingClientRect().top + window.pageYOffset - offsetY
  window.scrollTo({ top: y })
}

export const resetFocusFiles = (scrollToFilePath) => {
  const target = loopFileNodes({
    filePath: scrollToFilePath,
    showAllFiles: true,
  })

  if (!target) return false

  if (scrollToFilePath) {
    scrollTo(target)
  }

  return true
}

export const scrollToFile = (filePath) => {
  const target = loopFileNodes({ filePath })
  if (!target) return false

  scrollTo(target)
  return true
}
