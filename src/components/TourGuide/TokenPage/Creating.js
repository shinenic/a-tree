import { useState, useEffect } from 'react'
import ReactTour from 'reactour'

import { DEFAULT_NOTE, PHASE } from 'constants/tokenPage'

import { storePhase } from 'utils/tokenGuide'

const NOTE_INPUT_SELECTOR = 'input[id*="description"]'
const EXPIRATION_SELECTOR = 'select[class*="expiration"]'
const TOKEN_SCOPE_SELECTOR = '[class="token-scope"]' // First of the nodes should be `repo`
const FINISH_BUTTON_SELECTOR = '[class^="btn-primary btn"]'

const CREATING_STEPS = [
  {
    selector: NOTE_INPUT_SELECTOR,
    content: 'Fill in the note for the extension.',
    customAction: () => {
      document.querySelector(NOTE_INPUT_SELECTOR).value = DEFAULT_NOTE
    },
  },
  {
    selector: EXPIRATION_SELECTOR,
    content: 'Set expiration.',
  },
  {
    selector: TOKEN_SCOPE_SELECTOR,
    content: 'Check the "repo" is selected for repositories access',
    customAction: () => {
      document.querySelector(TOKEN_SCOPE_SELECTOR).click()
    },
  },
  {
    selector: FINISH_BUTTON_SELECTOR,
    content:
      "Finished! Don't forget to copy and paste the token into extension after generated.",
  },
]

/**
 * @TODO Replace `reactour` with other library due to it still needs `styled-components`
 * ref: https://github.com/elrumordelaluz/reactour/tree/50a4e056b58795f07478b9579b2d108fe4008b78#install
 */
function CreatingTokenTourGuide({ prevUrl }) {
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [steps, setSteps] = useState([])

  useEffect(() => {
    const validSteps = CREATING_STEPS.filter(({ selector }) =>
      document.querySelector(selector)
    )

    if (validSteps.length > 0) {
      validSteps.forEach(({ customAction }) => customAction && customAction())

      setSteps(validSteps)
      setIsTourOpen(validSteps.length > 0)
      storePhase(PHASE.START_CREATING, prevUrl)
    }
  }, [])

  return (
    <ReactTour
      closeWithMask={false}
      rounded={4}
      disableFocusLock
      steps={steps}
      isOpen={isTourOpen}
      onRequestClose={() => setIsTourOpen(false)}
    />
  )
}

export default CreatingTokenTourGuide
