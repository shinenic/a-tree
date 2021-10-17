import { scrollTo } from 'utils/scroll'
import { GITHUB_PAGE_CONTAINER_ID } from 'constants/github'
import { GITHUB_NAV_BAR_HEIGHT } from 'constants'
import { noop } from 'lodash'

const DEFAULT_TIMEOUT = 1000 * 6

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
  if (!diffContainer) {
    throw new Error('Can\'t find diff container DOM (id="files")')
  }

  const elementList = diffContainer.querySelectorAll('div[id*="diff-"]')

  if (!elementList.length) {
    throw new Error("Can't find any file block nodes")
  }

  return Array.from(elementList)
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
 * @param {boolean} option.focusFile if true, the nodes will be hidden
 *                                   except the node matches `filePath`
 * @param {boolean} option.showAllFiles if true, all of the nodes will be visible
 * @returns {HTMLElement} return the node of `filePath` if specified
 */
const loopFileNodes = ({ fileHash, focusFile, showAllFiles } = {}) => {
  if (focusFile && showAllFiles) {
    throw new Error('"focusFile" and "showAllFiles" can\'t be used together')
  }

  if (focusFile && !fileHash) {
    throw new Error('"focusFile" and "fileHash" should be used together')
  }

  const fileNodes = getFileNodes()

  let target = null

  fileNodes.forEach((node) => {
    if (node.id === fileHash) {
      target = node

      if (focusFile || showAllFiles) {
        node.style.display = null
      }
    } else if (showAllFiles) {
      node.style.display = null
    } else if (focusFile) {
      node.style.display = 'none'
    }
  })

  if (fileHash && !target) {
    throw new Error(`Can't find HTML node for file path "${fileHash}"`)
  }

  return target
}

export const focusFile = (fileHash) => {
  loopFileNodes({ fileHash, focusFile: true })
}

export const resetFocusFiles = () => {
  loopFileNodes({ showAllFiles: true })
}

export const scrollToFile = (fileHash) => {
  scrollTo(document.getElementById(fileHash), {
    offsetY: GITHUB_NAV_BAR_HEIGHT,
  })
}

/**
 * @param {(filename:string, checked: boolean) => void} callback
 */
export const generateReviewCheckListener = (callback = noop) => {
  const handler = (e) => {
    if (e.target.type !== 'checkbox') return

    // eslint-disable-next-line no-restricted-syntax
    for (const node of e.path) {
      if (/^diff-/.test(node.id)) {
        const link = node.querySelector(
          'a[href^="#diff"]:not([title*="Expand"])'
        )

        if (link) {
          const filename = link.title.includes(' → ')
            ? link.title.split(' → ')[1]
            : link.title

          callback(filename, e.target.checked)
        }
        break
      }
    }
  }

  const pageContainer = document.getElementById(GITHUB_PAGE_CONTAINER_ID)
  if (!pageContainer) return noop

  pageContainer.addEventListener('click', handler)

  return () => {
    pageContainer.removeEventListener('click', handler)
  }
}

export const checkFileNodeExisting = (fileHash, timeout = DEFAULT_TIMEOUT) =>
  new Promise((resolve, reject) => {
    let observer = null

    const handler = () => {
      if (document.querySelector(`div[id="${fileHash}"]`)) {
        observer && observer.disconnect()
        resolve()
      }
    }

    handler()
    observer = new MutationObserver(handler)

    observer.observe(document.querySelector('body'), {
      childList: true,
      subtree: true,
      attributes: true,
    })

    setTimeout(() => {
      observer.disconnect()
      reject()
    }, timeout)
  })

export const checkPjaxEnd = (timeout = DEFAULT_TIMEOUT) =>
  new Promise((resolve, reject) => {
    const handler = () => {
      window.removeEventListener('pjax:end', handler)

      resolve()
    }

    window.addEventListener('pjax:end', handler)

    setTimeout(() => {
      window.removeEventListener('pjax:end', handler)
      reject()
    }, timeout)
  })
