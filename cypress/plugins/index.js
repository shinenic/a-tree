const path = require('path')

// @FIXME Correct the path
const BUILD_PATH = path.resolve(__dirname, '..', '..', 'dist')

module.exports = (on) => {
  on('before:browser:launch', (browser, launchOptions) => {
    console.log('launching browser %o', browser)

    launchOptions.extensions.push(BUILD_PATH)

    return launchOptions
  })
}
