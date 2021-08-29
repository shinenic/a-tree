import { useState, useEffect } from 'react'
import ReactTour from 'reactour'

import {
  NEW_TOKEN_PATHNAME,
  DEFAULT_NOTE,
  TOKEN_GUIDE_LOCAL_STORAGE_KEY,
} from 'constants/tokenPage'
import useListenLocation from 'hooks/pageInfo/useListenLocation'

const NOTE_INPUT_SELECTOR = '[id="oauth_access_description"]'
const EXPIRATION_SELECTOR = '[id="oauth-token-expiration"]'
const TOKEN_SCOPE_SELECTOR = '[class="token-scope"]' // First of the nodes should be `repo`
const FINISH_BUTTON_SELECTOR = '[class^="btn-primary btn"]'

const STEPS = [
  {
    selector: NOTE_INPUT_SELECTOR,
    content: `Fill in the note for the extension.`,
  },
  {
    selector: EXPIRATION_SELECTOR,
    content: `Set expiration.`,
  },
  {
    selector: TOKEN_SCOPE_SELECTOR,
    content: `Check the "repo" is selected for repositories access`,
  },
  {
    selector: FINISH_BUTTON_SELECTOR,
    content: `Finished! Don't forget to copy and paste the token into extension after generated.`,
  },
]

/**
 * This token generating guide will only show when the localStorage has matched key,
 * and the pathname is `/settings/tokens/new`
 */
function GenerateTokenGuide() {
  const { pathname } = useListenLocation()
  const [isTourOpen, setIsTourOpen] = useState(false)

  useEffect(() => {
    const shouldOpenTour = localStorage.getItem(TOKEN_GUIDE_LOCAL_STORAGE_KEY)
    if (pathname !== NEW_TOKEN_PATHNAME || !shouldOpenTour) return

    const areNodesExisting = STEPS.every(({ selector }) => {
      if (!document.querySelector(selector)) {
        console.log(selector)
      }
      return document.querySelector(selector)
    })

    if (areNodesExisting) {
      document.querySelector(NOTE_INPUT_SELECTOR).value = DEFAULT_NOTE
      document.querySelector(TOKEN_SCOPE_SELECTOR).click()
      localStorage.removeItem(TOKEN_GUIDE_LOCAL_STORAGE_KEY)
    setIsTourOpen(areNodesExisting)
    }
  }, [pathname])

  return (
    <ReactTour
      disableFocusLock={true}
      steps={STEPS}
      isOpen={isTourOpen}
      onRequestClose={() => setIsTourOpen(false)}
    />
  )
}

export default GenerateTokenGuide
