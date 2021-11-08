import {
  useCallback,
  useEffect,
  useRef,
  useReducer,
  useMemo,
  useState,
} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import useSettingStore from 'stores/setting'

import {
  buildUsedLetterMap,
  highlightText,
  generateHotkeyListener,
} from 'utils/fileSearch'
import { isEmpty, throttle } from 'lodash'
import { CustomModal } from 'components/shared/Modal'
import useTreeItemClick from 'hooks/tree/useTreeItemClick'
import useQueryTree from 'hooks/tree/useQueryTree'
import usePopperStore from 'stores/popper'

import SearchBar from 'components/SearchBar'
import { initialState, reducer } from './reducer'
import * as Style from './style'

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    borderRadius: '12px',
    boxShadow: theme.shadows[5],
    padding: '8px 0',
    width: '650px',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const FileSearchWrapper = ({ pageInfo }) => {
  const isFileSearchOn = usePopperStore((s) => s.isFileSearchOn)
  const { files, isLoading, error } = useQueryTree(pageInfo, isFileSearchOn)
  const onItemClick = useTreeItemClick(pageInfo)

  return (
    <FileSearchModal
      files={files}
      selectCallback={onItemClick}
      isLoading={isLoading}
      error={error}
      isOpen={isFileSearchOn}
    />
  )
}

/**
 * @TODO Handle loading & error status
 * @TODO Handle SPA from page Pull-Conversation to page Pull-Files
 * @FIXME Can't apply focus file via press `enter`
 */
const FileSearchModal = ({
  isLoading,
  selectCallback,
  files,
  error,
  isOpen,
}) => {
  const [input, setInput] = useState('')
  const fileSearchHotkey = useSettingStore((s) => s.fileSearchHotkey)

  const [{ result = [], keyword = '', selectedIndex = 0, isOpened }, dispatch] =
    useReducer(reducer, {
      ...initialState,
      selectCallback,
    })
  const throttledUpdateKeyword = useCallback(
    throttle((newKeyword) => {
      dispatch({ type: 'UPDATE_KEYWORD', payload: { keyword: newKeyword } })
    }, 300),
    []
  )

  const classes = useStyles()
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isLoading && !isEmpty(files)) {
      dispatch({
        type: 'UPDATE_SOURCE_DATA',
        payload: {
          files: files?.filter(({ type }) => type !== 'tree') ?? [],
        },
      })
    } else {
      dispatch({ type: 'CLEAR_SOURCE_DATA' })
    }
  }, [isLoading, files])

  useEffect(() => {
    dispatch({ type: isOpen ? 'OPEN' : 'CLOSE' })
  }, [isOpen])

  useEffect(() => {
    dispatch({ type: 'UPDATE_SELECT_CALLBACK', payload: { selectCallback } })
  }, [selectCallback])

  /**
   * Auto focus input when modal opened
   */
  useEffect(() => {
    if (inputRef.current && isOpened) {
      inputRef.current.focus()
    }
  }, [isOpened])

  /**
   * Handle shortcuts
   */
  useEffect(() => {
    const unlisten = generateHotkeyListener(
      dispatch,
      isOpened,
      fileSearchHotkey
    )

    return () => unlisten()
  }, [fileSearchHotkey, isOpened])

  const handleInputChange = useCallback((e) => {
    e.preventDefault()
    setInput(e.target.value)
    throttledUpdateKeyword(e.target.value)
  }, [])

  const handleOptionClick = useCallback(
    (index) => () => {
      dispatch({ type: 'SELECT_INDEX', payload: { selectedIndex: index } })
    },
    []
  )
  const highlightMap = useMemo(() => buildUsedLetterMap(keyword), [keyword])

  if (error) return null

  return (
    <CustomModal
      isOpened={isOpened}
      onClose={() => dispatch({ type: 'CLOSE' })}
      overLayStyle={{ alignItems: 'start', paddingTop: '15vh' }}
    >
      <div className={classes.paper}>
        <SearchBar
          withBorder={false}
          showHints={false}
          placeholder="Enter keyword to search files..."
          inputRef={inputRef}
          value={input}
          withoutBorder
          onChange={handleInputChange}
        />
        {result.map((file, index) => {
          const paths = file.filename
            ? file.filename.split('/')
            : file.path.split('/')
          const path = paths.slice(0, -1).join('/')
          const fileName = paths.slice(-1).join()
          const isSelected = index === selectedIndex

          return (
            <Style.FileRow
              onClick={handleOptionClick(index)}
              key={paths.join('')}
              isSelected={isSelected}
            >
              <Style.FileName
                dangerouslySetInnerHTML={{
                  __html: highlightText(fileName, highlightMap),
                }}
              />
              <Style.FilePath
                dangerouslySetInnerHTML={{
                  __html: highlightText(path, highlightMap),
                }}
                tooltip={path}
              />
            </Style.FileRow>
          )
        })}
      </div>
    </CustomModal>
  )
}

export default FileSearchWrapper
