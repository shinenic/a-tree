import { useEffect } from 'react'
import useSwitch from 'hooks/useSwitch'
import { DEFAULT_NOTE, PHASE } from 'constants/tokenPage'
import { storePhase } from 'utils/tokenGuide'

import Tour from 'components/shared/Tour'

const NOTE_INPUT_SELECTOR = 'input[id*="description"]'
const EXPIRATION_SELECTOR = 'select[class*="expiration"]'
const TOKEN_SCOPE_SELECTOR = '[class="token-scope"]' // First of the nodes should be `repo`
const FINISH_BUTTON_SELECTOR = '[class^="btn-primary btn"]'

const CREATING_STEPS = [
  {
    selector: NOTE_INPUT_SELECTOR,
    content: 'Fill in the note for the extension.',
    position: 'right',
    initAction: () => {
      document.querySelector(NOTE_INPUT_SELECTOR).value =
        `${DEFAULT_NOTE}-${new Date().getTime()}`
    },
  },
  {
    selector: EXPIRATION_SELECTOR,
    position: 'top',
    content: 'Set expiration.',
  },
  {
    selector: TOKEN_SCOPE_SELECTOR,
    content: 'Check the "repo" is selected for repositories access',
    position: 'left',
    initAction: () => {
      document.querySelector(TOKEN_SCOPE_SELECTOR).click()
    },
  },
  {
    selector: FINISH_BUTTON_SELECTOR,
    position: 'top',
    content: (
      <span>
        Finished!
        <br />
        Don't forget to copy and paste the token into extension after generated.
      </span>
    ),
  },
]

function CreatingTokenTourGuide({ prevUrl }) {
  const [isOpening, open] = useSwitch()

  useEffect(() => {
    open()
  }, []) // eslint-disable-line

  return (
    <Tour
      isOpening={isOpening}
      customSteps={CREATING_STEPS}
      onFinish={() => storePhase(PHASE.START_CREATING, prevUrl)}
    />
  )
}

export default CreatingTokenTourGuide
