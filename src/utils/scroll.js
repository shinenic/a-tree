export const GITHUB_NAV_BAR_HEIGHT = 60

export const scrollTo = (
  target,
  { smooth = false, offsetY = 0, callback } = {}
) => {
  if (!target) return

  if (callback) {
    let scrollTimeout = null

    const onScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        callback()
        window.removeEventListener('scroll', onScroll)
      }, 50)
    }

    window.addEventListener('scroll', onScroll)

    onScroll() // Fire immediately if the scroll position is already correct
  }

  window.scrollTo({
    top: target.getBoundingClientRect().top + window.pageYOffset - offsetY,
    ...(smooth && { behavior: 'smooth' }),
  })
}

export const scrollToTabsNav = () => {
  document.querySelector('nav[class*="tabnav-tabs"]')?.scrollIntoView()
}
