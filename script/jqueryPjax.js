const fs = require('fs')
const path = require('path')

function generateStaticFile() {
  const nativeContent = fs.readFileSync(
    path.join(__dirname, '../node_modules/jquery-pjax/jquery.pjax.js'),
    'utf8'
  )

  const newContent = `import jQuery from 'jquery'
  ${nativeContent}`

  fs.writeFileSync(
    path.join(__dirname, '../src/libs/jqueryPjax.js'),
    newContent
  )
}

function checkTargetFolders() {
  if (!fs.existsSync(path.join(__dirname, '../src/libs'))) {
    fs.mkdirSync(path.join(__dirname, '../src/libs'))
  }
}

checkTargetFolders()
generateStaticFile()
