import React from 'react'
import { ERROR_MESSAGE } from 'constants'
import { useSettingCtx } from 'components/Setting/Context/Provider'

import * as Style from './style'

const Error = ({ errorMessage }) => {
  const { token } = useSettingCtx()

  return (
    <Style.ErrorContainer>
      <div>
        {errorMessage === ERROR_MESSAGE.TOKEN_INVALID &&
          `It seems that the token is expired or invalid, please try to create
            a new one.`}
        {errorMessage === ERROR_MESSAGE.NO_PERMISSION &&
          token &&
          `It seems that the token has no permission to access this repository.`}
        {errorMessage === ERROR_MESSAGE.NO_PERMISSION &&
          !token &&
          `It seems that this is an private repository, please create a personal token to access this repository!`}
      </div>
      <Style.HintContent>
        {/* @TODO: Add tutorial */}
        How to create personal access tokens?
      </Style.HintContent>
    </Style.ErrorContainer>
  )
}

export default Error
