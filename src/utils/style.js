export const getNativeBodyStyles = () => {
  return window.getComputedStyle(document.body)
}

export const getHeaderHeight = () => {
  return window.getComputedStyle(document.querySelector('header')).height
}
