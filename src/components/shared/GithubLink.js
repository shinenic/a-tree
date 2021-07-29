import { PJAX_LINK_ID } from 'constants/github'

const getHrefPathname = (href = '') => {
  try {
    const url = new URL(href)
    return url.pathname
  } catch {
    const url = new URL(href, 'https://github.com')
    return url.pathname
  }
}

/**
 * Component for navigation to Github page without refresh.
 *
 * @note These approach is based on `PJAX` attribute, but sometimes failed in some cases
 *       e.g. user page <=> other pages
 * @example
 *   <GithubLink href="/user/repo/">repo index</GithubLink>
 */
const GithubLink = ({
  href = '/',
  disableSPA = false,
  skipIfSamePathname = true,
  onClick,
  children,
  ...rest
}) => {
  const handleClick = (e) => {
    if (
      skipIfSamePathname &&
      getHrefPathname(href) === window.location.pathname
    ) {
      e.preventDefault()
    }

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      {...(!disableSPA && { 'data-pjax': PJAX_LINK_ID })}
      {...rest}
    >
      {children}
    </a>
  )
}

export default GithubLink
