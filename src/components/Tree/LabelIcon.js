import React from 'react'
import PropTypes from 'prop-types'
import { AiOutlineFileText } from 'react-icons/ai'
import { FaPenSquare, FaPlusSquare, FaWindowClose } from 'react-icons/fa'
import { MAIN_COLOR, MODIFY_COLOR, ADD_COLOR, DELETE_COLOR } from './constants'

const STATUS = {
  NORMAL: 'normal',
  RENAMED: 'renamed',
  MODIFIED: 'modified',
  ADDED: 'added',
  REMOVED: 'removed',
}

const { NORMAL, RENAMED, MODIFIED, ADDED, REMOVED } = STATUS

const LabelIcon = ({ status }) => {
  switch (status) {
    case NORMAL:
    case RENAMED:
    default:
      return <AiOutlineFileText color={MAIN_COLOR} />
    case MODIFIED:
      return <FaPenSquare color={MODIFY_COLOR} />
    case ADDED:
      return <FaPlusSquare color={ADD_COLOR} />
    case REMOVED:
      return <FaWindowClose color={DELETE_COLOR} />
  }
}

LabelIcon.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUS)),
}

export default LabelIcon
