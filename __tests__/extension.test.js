const hasElement = async (page, selector, timeout) => {
  try {
    const element = await page.waitForSelector(selector, { timeout })
    return Boolean(element)
  } catch (error) {
    return false
  }
}

describe(`Extension visibility`, () => {
  it('should render A-Tree on Code page', async () => {
    await page.goto('https://github.com/shinenic/a-tree')

    await page.setViewport({ width: 1440, height: 1080 })
    await page.waitForTimeout(3000)

    await page.screenshot({ path: `github-repo.jpeg` })

    await expect(hasElement(page, '#a-tree', 2000)).resolves.toBeTruthy()
  })

  it('should not render A-Tree on nor related host', async () => {
    page.goto('https://google.com')
    await expect(hasElement(page, '#a-tree', 2000)).resolves.toBeFalsy()
  })
})

describe(`Code page SPA (without refresh)`, () => {
  it('should not refresh when click the tree node', async () => {
    await page.goto('https://github.com/shinenic/a-tree')

    await page.waitForSelector('[data-attr="token-guide-close-button"]')
    await page.click('[data-attr="token-guide-close-button"]')

    await page.waitForSelector('div[title=".gitignore"]')
    await page.click('div[title=".gitignore"]')
    await page.waitForTimeout(100)

    // @TODO Check if the page is refreshed in a better approach
    await expect(
      hasElement(page, 'div[title=".gitignore"]', 0)
    ).resolves.toBeTruthy()
  })
})
