export const hasElement = async (page, selector, timeout) => {
  try {
    const element = await page.waitForSelector(selector, { timeout })
    return Boolean(element)
  } catch (error) {
    return false
  }
}

export const getAttribute = (selector, attribute) => {
  return page.evaluate(`document.querySelector('${selector}').getAttribute('${attribute}')`)
}

export const clickElement = (selector) => {
  return page.$eval(selector, (element) => element.click())
}

export const waitAndClick = async (selector) => {
  await page.waitForSelector(selector)
  await clickElement(selector)
}

export const getTimestamp = () => {
  return getAttribute('#a-tree', 'timestamp')
}

export const clickWelcomeDialog = async () => {
  await waitAndClick('[data-attr="token-guide-close-button"]')
}
