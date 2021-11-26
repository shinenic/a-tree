const fs = require('fs')
const path = require('path')
const PACKAGE = require('../package.json')

const output = {
  name: 'A-Tree - Github review helper',
  short_name: 'A-Tree',
  version: PACKAGE.version,
  description: PACKAGE.description,
  homepage_url: PACKAGE.homepage,
  manifest_version: 3,
  minimum_chrome_version: '88',
  permissions: ['contextMenus'],
  icons: {
    192: './icon192.png',
  },
  background: {
    service_worker: 'background.js',
  },
  content_scripts: [
    {
      run_at: 'document_start',
      matches: ['<all_urls>'],
      js: ['content.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['*'],
      matches: ['<all_urls>'],
    },
  ],
}

fs.writeFileSync(
  path.join(__dirname, '../', 'manifest.json'),
  JSON.stringify(output, null, 2)
)
