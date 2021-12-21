import { hasElement, clickWelcomeDialog, getTimestamp, waitAndClick } from './utils/base'

describe('Extension visibility', () => {
  it('should render A-Tree on Code page', async () => {
    await page.goto('https://github.com/shinenic/a-tree')

    await page.setViewport({ width: 1440, height: 1080 })
    await page.waitForTimeout(3000)

    await page.screenshot({ path: 'github-repo.jpeg' })

    await expect(hasElement(page, '#a-tree', 2000)).resolves.toBeTruthy()
  })

  it('should not render A-Tree on nor related host', async () => {
    page.goto('https://google.com')
    await expect(hasElement(page, '#a-tree', 2000)).resolves.toBeFalsy()
  })
})

describe('Extension Links (SPA)', () => {
  it('should not refresh when browser between code files', async () => {
    await page.goto('https://github.com/shinenic/a-tree')

    await clickWelcomeDialog()
    const timestamp1 = await getTimestamp()

    await waitAndClick('div[title=".gitignore"]')
    await page.waitForTimeout(800)

    const timestamp2 = await getTimestamp()
    expect(timestamp1 === timestamp2).toBeTruthy()

    await waitAndClick('div[title=".gitattributes"]')
    await page.waitForTimeout(800)

    await page.waitForSelector('div[title=".gitattributes"]')
    const timestamp3 = await getTimestamp()
    expect(timestamp2 === timestamp3).toBeTruthy()
  })

  it('should not refresh when browser a pull request', async () => {
    await page.goto('https://github.com/shinenic/a-tree/pull/20')
    const timestamp1 = await getTimestamp()

    await waitAndClick('div[title=".gitignore"]')
    await page.waitForTimeout(800)

    await page.waitForSelector('div[title=".gitignore"]')
    const timestamp2 = await getTimestamp()

    expect(timestamp1 === timestamp2).toBeTruthy()
  })

  it('should not refresh when browser between commits', async () => {
    await page.goto('https://github.com/shinenic/a-tree/pull/20')
    const timestamp1 = await getTimestamp()

    await waitAndClick('#commit-menu-btn')
    await page.waitForTimeout(800)

    await waitAndClick(
      '[href="/shinenic/a-tree/pull/20/commits/5221564d3cf92c46c6451dc6a309cf518498f2c2"]'
    )
    await page.waitForTimeout(800)

    const timestamp2 = await getTimestamp()

    expect(timestamp1 === timestamp2).toBeTruthy()
  })
})
