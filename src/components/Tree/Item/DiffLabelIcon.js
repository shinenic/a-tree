import React from 'react'
import PropTypes from 'prop-types'
import { AiOutlineFileText } from 'react-icons/ai'
import { FaPenSquare, FaPlusSquare, FaWindowClose } from 'react-icons/fa'
import { useTheme } from '@material-ui/core/styles'
import tinycolor from 'tinycolor2'
import { MAIN_COLOR, MODIFY_COLOR, ADD_COLOR, DELETE_COLOR } from './constants'

const STATUS = {
  NORMAL: 'normal',
  RENAMED: 'renamed',
  MODIFIED: 'modified',
  ADDED: 'added',
  REMOVED: 'removed',
}

const { NORMAL, RENAMED, MODIFIED, ADDED, REMOVED } = STATUS

const getIconColor = (color, theme) => {
  return theme.palette.type === 'dark'
    ? tinycolor(color).brighten(60).toHexString()
    : color
}

const DiffLabelIcon = ({ status }) => {
  const theme = useTheme()

  switch (status) {
    case NORMAL:
    case RENAMED:
    default:
      return <AiOutlineFileText color={getIconColor(MAIN_COLOR, theme)} />
    case MODIFIED:
      return <FaPenSquare color={MODIFY_COLOR} />
    case ADDED:
      return <FaPlusSquare color={ADD_COLOR} />
    case REMOVED:
      return <FaWindowClose color={DELETE_COLOR} />
  }
}

DiffLabelIcon.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUS)).isRequired,
}

export default DiffLabelIcon
