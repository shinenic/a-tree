import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFileText,
} from 'react-icons/ai'
import { useTheme } from '@material-ui/core/styles'
import tinycolor from 'tinycolor2'
import { FILE_ICON_STYLE } from 'constants/base'
import CircularProgress from '@material-ui/core/CircularProgress'
import useSettingStore from 'stores/setting'

import {
  getClassWithColor as getFileIconClassesWithColor,
  getClass as getFileIconClasses,
} from 'file-icons-js'

import { MAIN_COLOR } from './constants'
import DiffLabelIcon from './Diff'

const NodeIcon = ({ isOpen, isLeaf, status, isLoading, name }) => {
  const theme = useTheme()
  const fileIconStyle = useSettingStore((s) => s.fileIconStyle)

  const color =
    theme.palette.type === 'dark'
      ? tinycolor(MAIN_COLOR).brighten(60).toHexString()
      : MAIN_COLOR

  if (isLoading) return <CircularProgress size={18} />
  if (status) return <DiffLabelIcon status={status} />
  if (!isLeaf) {
    return isOpen ? (
      <AiFillFolderOpen color={color} />
    ) : (
      <AiFillFolder color={color} />
    )
  }

  if (
    fileIconStyle === FILE_ICON_STYLE.COLORFUL &&
    getFileIconClassesWithColor(name)
  ) {
    return (
      <i
        className={getFileIconClassesWithColor(name)}
        style={{ fontStyle: 'normal' }}
      />
    )
  }

  if (fileIconStyle === FILE_ICON_STYLE.DEFAULT && getFileIconClasses(name)) {
    return (
      <i className={getFileIconClasses(name)} style={{ fontStyle: 'normal' }} />
    )
  }

  return <AiOutlineFileText color={color} />
}

export default NodeIcon
