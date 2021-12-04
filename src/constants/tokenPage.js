import { LOCAL_STORAGE_KEY_PREFIX } from 'constants/base'

export const NEW_TOKEN_PATHNAME = '/settings/tokens/new'

export const TOKENS_PATHNAME = '/settings/tokens'

export const DEFAULT_NOTE = '[Chrome Extension] A-Tree'

export const TOKEN_GUIDE_LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_KEY_PREFIX}token-guide`

export const TOKEN_VALUE_TTL = 1000 * 60 * 5

export const PHASE = {
  NONE: 0,
  START_TOUR: 1,
  START_CREATING: 2,
}
