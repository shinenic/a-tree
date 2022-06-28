import jQuery from 'jquery'
import 'libs/jqueryPjax'
import { GITHUB_PAGE_CONTAINER_ID } from 'constants/github'

export const GH_PJAX_CONTAINERS = [`#${GITHUB_PAGE_CONTAINER_ID}`, '[data-pjax-container]']

export const getContainer = () => {
  return GH_PJAX_CONTAINERS.find((selector) => document.querySelector(selector))
}

/**
 * @NOTE We should use jquery-pjax to handle SPA,
 *       and use jquery to listen pjax events only.
 * @TODO Handle spa & pjax without `jquery`
 */
export const loadPjaxPage = (fullUrl = '') => {
  jQuery.pjax({
    url: fullUrl,
    container: getContainer(),
    timeout: 0
  })
}

export const listenPjaxEvent = (event = '', callback = () => {}) => {
  jQuery(window).on(`pjax:${event}`, callback)

  return () => {
    jQuery(window).off(`pjax:${event}`, callback)
  }
}

export const listenTurboEvent = (callback = () => {}) => {
  window.addEventListener('turbo:load', callback)

  return () => {
    window.removeEventListener('turbo:load', callback)
  }
}
