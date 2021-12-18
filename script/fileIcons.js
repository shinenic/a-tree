/**
 * Generator static files into `libs` folder to ensure the css and fonts won't
 * be injected into the websites that aren't Github pages
 */
const fs = require('fs')
const path = require('path')

function escapeCssString(str) {
  return str.split('\\').join('\\\\')
}

function generateMinifiedFileIconsCss() {
  const css = fs.readFileSync(
    path.join(__dirname, '../node_modules/file-icons-js/css/style.css'),
    'utf8'
  )
  const cssWithoutFonts = css.replace(/@font-face[^}]+}/g, '')
  const cssMinified = cssWithoutFonts
    .replace(/\s+/g, ' ')
    .replace(/\} /g, '}\n')
    .replace(/\/\*.*?\*\//g, '')
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ')

  const cssExportFileContent = `const css = '${escapeCssString(
    cssMinified
  )}'; export default css`

  fs.writeFileSync(
    path.join(__dirname, '../src/libs/fileIconStyles.js'),
    cssExportFileContent
  )
}

function copyFontFiles() {
  const files = fs.readdirSync(
    path.join(__dirname, '../node_modules/file-icons-js/fonts')
  )
  files.forEach((file) => {
    fs.copyFileSync(
      path.join(__dirname, '../node_modules/file-icons-js/fonts', file),
      path.join(__dirname, '../public/fileIcons', file)
    )
  })
}

function checkTargetFolders() {
  if (!fs.existsSync(path.join(__dirname, '../public/fileIcons'))) {
    fs.mkdirSync(path.join(__dirname, '../public/fileIcons'))
  }

  if (!fs.existsSync(path.join(__dirname, '../src/libs'))) {
    fs.mkdirSync(path.join(__dirname, '../src/libs'))
  }
}

checkTargetFolders()
generateMinifiedFileIconsCss()
copyFontFiles()
