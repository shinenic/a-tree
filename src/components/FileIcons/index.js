import { useEffect } from 'react'
import { getURL } from 'utils/chrome'

import IconsCssString from 'libs/fileIconStyles'

const FONTS = [
  { name: 'FontAwesome', path: 'fileIcons/fontawesome.woff2' },
  { name: 'Mfizz', path: 'fileIcons/mfixx.woff2' },
  { name: 'Devicons', path: 'fileIcons/devopicons.woff2' },
  { name: 'file-icons', path: 'fileIcons/file-icons.woff2' },
  { name: 'octicons', path: 'fileIcons/octicons.woff2' },
]

const loadFonts = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const font of FONTS) {
    const fontFace = new FontFace(
      font.name,
      `url("${getURL(font.path)}") format("woff2")`,
      { style: 'normal', weight: 'normal' }
    )

    const loadedFontFace = await fontFace.load()
    document.fonts.add(loadedFontFace)
  }
}

// Instead of load css file via `manifest.json`,
// render the CSS string into the DOM & load the necessary fonts if extension is enabled
// to prevent unused css included
// ref: https://github.com/websemantics/file-icons-js
const FileIcons = () => {
  useEffect(() => {
    loadFonts()
  }, [])

  return <style>{IconsCssString}</style>
}

export default FileIcons
