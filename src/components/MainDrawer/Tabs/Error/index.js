import React from 'react'
import { ERROR_MESSAGE } from 'constants'
import useStore from 'stores/setting'
import { NEW_TOKEN_PATHNAME } from 'constants/tokenPage'
import { PHASE, storePhase } from 'components/Tour/GenerateTokenGuide'

import * as Style from './style'

const Error = ({ errorMessage }) => {
  const token = useStore((s) => s.token)

  const handleHintClick = () => {
    storePhase(PHASE.START_TOUR)
    window.location.href = NEW_TOKEN_PATHNAME
  }

  return (
    <Style.ErrorContainer>
      <div>
        {errorMessage === ERROR_MESSAGE.API_RATE_LIMIT &&
          'API rate limit exceeded, please try to create a token to get a higher rate limit'}
        {errorMessage === ERROR_MESSAGE.TOKEN_INVALID &&
          `It seems that the token is expired or invalid, please try to create
            a new one.`}
        {errorMessage === ERROR_MESSAGE.NO_PERMISSION &&
          token &&
          'It seems that the token has no permission to access this repository.'}
        {errorMessage === ERROR_MESSAGE.NO_PERMISSION &&
          !token &&
          'It seems that this is an private repository, please create a personal token to access this repository!'}
      </div>
      <Style.HintContent onClick={handleHintClick}>
        How to create a new token?
      </Style.HintContent>
    </Style.ErrorContainer>
  )
}

export default Error
