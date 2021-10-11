import { useMemo } from 'react'

import { NEW_TOKEN_PATHNAME, PHASE, TOKENS_PATHNAME } from 'constants/tokenPage'
import { getCurrentPhase } from 'utils/tokenGuide'
import CreatingTokenTourGuide from './Creating'
import CreatedTokenTourGuide from './Created'

/**
 * This token generating guide will only show when the localStorage has matched phase
 * and the pathname is `/settings/tokens/new` or `/settings/tokens`
 */
function GenerateTokenGuide() {
  /**
   * Check pathname and phase only once. (No SPA)
   */
  const pathname = useMemo(() => window.location.pathname, [])
  const { phase, prevUrl } = useMemo(() => getCurrentPhase(), [])

  if (phase === PHASE.START_TOUR && pathname === NEW_TOKEN_PATHNAME) {
    return <CreatingTokenTourGuide prevUrl={prevUrl} />
  }

  if (phase === PHASE.START_CREATING && pathname === TOKENS_PATHNAME) {
    return <CreatedTokenTourGuide prevUrl={prevUrl} />
  }

  return null
}

export default GenerateTokenGuide
