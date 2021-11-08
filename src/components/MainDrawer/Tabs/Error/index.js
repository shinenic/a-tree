import { ERROR_MESSAGE, isGithubHost } from 'constants'
import useSettingStore from 'stores/setting'
import { startTokenGuide } from 'utils/tokenGuide'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

import * as Style from './style'

const Error = ({ errorMessage = ERROR_MESSAGE.API_RATE_LIMIT }) => {
  const token = useSettingStore((s) => s.token)

  const enterpriseHint = () => {
    if (errorMessage === ERROR_MESSAGE.API_RATE_LIMIT) {
      return (
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: 30 }}
        >
          If this issue happens on your enterprise account, please try the{' '}
          <Link
            href="https://docs.github.com/en/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on"
            target="_blank"
            rel="noopener noference"
            underline="none"
          >
            follow official guide
          </Link>{' '}
          to enable SSO.
        </Typography>
      )
    }

    return (
      <Typography
        variant="body2"
        color="textSecondary"
        style={{ marginTop: 30 }}
      >
        If it's not a expected domain, please
        <b> right-click</b> to disable it.
      </Typography>
    )
  }

  return (
    <Style.ErrorContainer>
      <Typography variant="body2">
        {errorMessage === ERROR_MESSAGE.API_RATE_LIMIT &&
          'API rate limit exceeded, please try to create a new token to get a higher rate limit'}
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
      {!isGithubHost && enterpriseHint()}
      <Style.HintContent onClick={startTokenGuide}>
        How to create a new token?
      </Style.HintContent>
    </Style.ErrorContainer>
  )
}

export default Error
