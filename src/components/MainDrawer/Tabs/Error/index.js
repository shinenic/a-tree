import { useMemo } from 'react'
import { ERROR_MESSAGE } from 'constants'
import useStore from 'stores/setting'
import { startTokenGuide } from 'utils/tokenGuide'
import Typography from '@material-ui/core/Typography'

import * as Style from './style'

const Error = ({ errorMessage }) => {
  const token = useStore((s) => s.token)
  const isGithubHost = useMemo(() => window.location.host === 'github.com', [])

  return (
    <Style.ErrorContainer>
      <Typography variant="body2">
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
      </Typography>
      {!isGithubHost && (
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: 30 }}
        >
          If it's not a expected domain, please
          <b> right-click</b> to disable it.
        </Typography>
      )}
      <Style.HintContent onClick={startTokenGuide}>
        How to create a new token?
      </Style.HintContent>
    </Style.ErrorContainer>
  )
}

export default Error
