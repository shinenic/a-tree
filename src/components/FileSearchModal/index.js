import { useCallback, useEffect, useRef, useReducer, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useQueryFiles } from 'hooks/api/useGithubQueries'

import {
  buildUsedLetterMap,
  highlightText,
  generateHotkeyListener,
} from 'utils/fileSearch'
import { initialState, reducer } from './reducer'
import { isEmpty } from 'lodash'
import * as Style from './style'

import Modal from 'components/shared/Modal'

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #666',
    borderRadius: '4px',
    boxShadow: theme.shadows[5],
    padding: '8px 0',
    width: '650px',
    display: 'flex',
    flexDirection: 'column',
  },
}))

/**
 * @TODO Handle loading status
 */
const FileSearchModal = ({ owner, repo, branch }) => {
  const classes = useStyles()
  const inputRef = useRef(null)

  const [{ result = [], keyword = '', selectedIndex = 0, isOpened }, dispatch] =
    useReducer(reducer, {
      ...initialState,
      pageInfo: { owner, repo, branch },
    })

  const { data, isLoading, error } = useQueryFiles({ owner, repo, branch })

  useEffect(() => {
    dispatch({ type: 'SET_IS_LOADING', payload: { isLoading } })

    if (!isLoading && !isEmpty(data)) {
      dispatch({
        type: 'UPDATE_SOURCE_DATA',
        payload: {
          files: data?.tree?.filter(({ type }) => type !== 'tree') ?? [],
        },
      })
    }
  }, [isLoading, data])

  useEffect(() => {
    dispatch({
      type: 'UPDATE_PAGE_INFO',
      payload: { pageInfo: { owner, repo, branch } },
    })
  }, [owner, repo, branch])

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
    const unlisten = generateHotkeyListener(dispatch, isOpened)

    return () => unlisten()
  }, [isOpened])

  const handleInputChange = useCallback((e) => {
    e.preventDefault()
    dispatch({ type: 'UPDATE_KEYWORD', payload: { keyword: e.target.value } })
  }, [])

  const handleOptionClick = useCallback(
    (selectedIndex) => () => {
      dispatch({ type: 'SELECT_INDEX', payload: { selectedIndex } })
    },
    []
  )
  const highlightMap = useMemo(() => buildUsedLetterMap(keyword), [keyword])

  if (error || !owner || !repo) return null

  return (
    <Modal
      isOpened={isOpened}
      onClose={() => dispatch({ type: 'CLOSE' })}
      overLayStyle={{ alignItems: 'start', paddingTop: '15vh' }}
    >
      <div className={classes.paper}>
        <Style.Input
          placeholder="Enter keyword to search files..."
          ref={inputRef}
          value={keyword}
          onChange={handleInputChange}
        />
        {result.map((file, index) => {
          const paths = file.path.split('/')
          const path = paths.slice(0, -1).join('/')
          const fileName = paths.slice(-1).join()
          const isSelected = index === selectedIndex

          return (
            <Style.FileRow
              onClick={handleOptionClick(index)}
              key={file.path}
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
              />
            </Style.FileRow>
          )
        })}
      </div>
    </Modal>
  )
}

export default FileSearchModal
