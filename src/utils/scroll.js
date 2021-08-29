export const GITHUB_NAV_BAR_HEIGHT = 60

export const scrollTo = (
  target,
  { smooth = false, offsetY = GITHUB_NAV_BAR_HEIGHT } = {}
) => {
  if (!target) return

  const y = target.getBoundingClientRect().top + window.pageYOffset - offsetY
  window.scrollTo({ top: y, ...(smooth && { behavior: 'smooth' }) })
}

export const scrollToTabsNav = () => {
  document.querySelector('nav[class*="tabnav-tabs"]')?.scrollIntoView()
}
