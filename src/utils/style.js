import { DEFAULT_HEADER_HEIGHT } from 'constants'

export const getNativeBodyStyles = () => {
  return window.getComputedStyle(document.body)
}

export const getHeaderHeight = () => {
  const header = document.querySelector('header')

  if (document.querySelector('header')) {
    return window.getComputedStyle(header).height
  }

  return `${DEFAULT_HEADER_HEIGHT}px`
}

export const getCommonScrollbarStyle = (theme) => ({
  /* width */
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },

  /* Track */
  '&::-webkit-scrollbar-track': {
    background: theme.palette.type === 'dark' ? '#3b3b3b' : '#f1f1f188',
  },

  /* Handle */
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.type === 'dark' ? '#bbb6' : '#bbb8',
  },

  /* Handle on hover */
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.type === 'dark' ? '#8886' : '#8888',
  },
})
