export const isEllipsisActive = (e) => {
  return !!e && e.offsetWidth < e.scrollWidth
}
