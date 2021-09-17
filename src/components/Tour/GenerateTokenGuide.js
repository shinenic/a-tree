import { useState, useEffect, useMemo } from 'react'
import ReactTour from 'reactour'

import {
  NEW_TOKEN_PATHNAME,
  DEFAULT_NOTE,
  TOKENS_PATHNAME,
  TOKEN_VALUE_TTL,
  TOKEN_GUIDE_LOCAL_STORAGE_KEY,
} from 'constants/tokenPage'
import { toSafeInteger } from 'lodash'
import useListenLocation from 'hooks/pageInfo/useListenLocation'
import { useSettingDispatchCtx } from 'components/Setting/Context/Provider'

const NOTE_INPUT_SELECTOR = 'input[id*="description"]'
const EXPIRATION_SELECTOR = 'select[class*="expiration"]'
const TOKEN_SCOPE_SELECTOR = '[class="token-scope"]' // First of the nodes should be `repo`
const FINISH_BUTTON_SELECTOR = '[class^="btn-primary btn"]'
const NEW_OAUTH_TOKEN_SELECTOR = '[id="new-oauth-token"]'

export const PHASE = {
  NONE: 0,
  START_TOUR: 1,
  START_CREATING: 2,
}

const CREATING_STEPS = [
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

const CREATED_STEPS = [
  {
    selector: NEW_OAUTH_TOKEN_SELECTOR,
    content: (
      <p>
        Token created 🎉
        <br /> It has been copied in our setting, enjoy it!
      </p>
    ),
  },
]

const CREATED_TOUR_OPTIONS = {
  showNumber: false,
  showNavigation: false,
  showNavigationNumber: false,
  showButtons: false,
  showCloseButton: false,
}

export const storePhase = (phase = 0) => {
  if (!phase) {
    localStorage.removeItem(TOKEN_GUIDE_LOCAL_STORAGE_KEY)
  } else {
    const value = { phase, timestamp: new Date().getTime() }
    localStorage.setItem(TOKEN_GUIDE_LOCAL_STORAGE_KEY, JSON.stringify(value))
  }
}

const getCurrentPhase = () => {
  try {
    const { phase, timestamp } = JSON.parse(
      localStorage.getItem(TOKEN_GUIDE_LOCAL_STORAGE_KEY)
    )

    if (new Date().getTime() - toSafeInteger(timestamp) > TOKEN_VALUE_TTL) {
      throw new Error('Timeout')
    }

    return toSafeInteger(phase)
  } catch {
    storePhase()
    return 0
  }
}

/**
 * This token generating guide will only show when the localStorage has matched phase
 * and the pathname is `/settings/tokens/new` or `/settings/tokens`
 */
function GenerateTokenGuide() {
  const { pathname } = useListenLocation()
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [steps, setSteps] = useState([])
  const dispatch = useSettingDispatchCtx()

  const phase = useMemo(() => getCurrentPhase(), [])

  /**
   * Handle token creating
   */
  useEffect(() => {
    if (phase !== PHASE.START_TOUR || pathname !== NEW_TOKEN_PATHNAME) {
      return
    }

    const areNodesExisting = CREATING_STEPS.every(({ selector }) => {
      if (!document.querySelector(selector)) {
        console.log(`Node ${selector} not found`)
      }

      return document.querySelector(selector)
    })

    if (areNodesExisting) {
      document.querySelector(NOTE_INPUT_SELECTOR).value = DEFAULT_NOTE
      document.querySelector(TOKEN_SCOPE_SELECTOR).click()
      setSteps(CREATING_STEPS)
      setIsTourOpen(areNodesExisting)
      storePhase(PHASE.START_CREATING)
    }
  }, [])

  /**
   * Handle token created
   */
  useEffect(() => {
    if (phase !== PHASE.START_CREATING || pathname !== TOKENS_PATHNAME) {
      return
    }

    const areNodesExisting = CREATED_STEPS.every(({ selector }) => {
      if (!document.querySelector(selector)) {
        console.log(`Node ${selector} not found`)
      }

      return document.querySelector(selector)
    })

    const newToken = document.querySelector(NEW_OAUTH_TOKEN_SELECTOR).innerText

    if (areNodesExisting && newToken) {
      setSteps(CREATED_STEPS)
      setIsTourOpen(areNodesExisting)
      storePhase()

      dispatch({ type: 'UPDATE_TOKEN', payload: newToken })
    }
  }, [])

  return (
    <ReactTour
      rounded={4}
      disableFocusLock={true}
      steps={steps}
      isOpen={isTourOpen}
      onRequestClose={() => setIsTourOpen(false)}
      {...(phase === PHASE.START_CREATING && CREATED_TOUR_OPTIONS)}
    />
  )
}

export default GenerateTokenGuide
