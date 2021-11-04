export const isWindows = (userAgent = window.navigator.userAgent) =>
  userAgent.toLowerCase().includes('windows')
