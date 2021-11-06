export function openInNewTab(url) {
  window.open(url, '_blank').focus()
}

export function download(filename, text) {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
  )
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}
