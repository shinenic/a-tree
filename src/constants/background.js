/**
 * @Note `window` object is not defined in background services,
 * so do not access window in this file and background script.
 */

export const GLOBAL_MESSAGE_TYPE = {
  ON_HISTORY_UPDATED: 'ON_HISTORY_UPDATED',
  ON_CONTEXT_MENU_CLICKED: 'ON_CONTEXT_MENU_CLICKED',
}

export const CONTEXT_MENU_ITEM_ID = {
  ENABLE_EXTENSION: 'enable-extension',
  DISABLE_EXTENSION: 'disable-extension',
}
