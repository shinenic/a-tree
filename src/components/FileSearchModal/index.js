import { useCallback, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useQueryFiles } from 'hooks/api/useGithubQueries'

import { createFileSearchMachine } from 'machines/fileSearch'
import { useMachine, useActor } from '@xstate/react'
import { getFileLink } from 'utils/link'
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

const buildUsedLetterMap = (keyword) => {
  return [...keyword].reduce(
    (map, letter) =>
      /[a-zA-Z]/.test(letter)
        ? { ...map, [letter.toLowerCase()]: true, [letter.toUpperCase()]: true }
        : map,
    {}
  )
}

const highlightText = (text, highlightLetterMap) => {
  return [...text]
    .map((letter) => (highlightLetterMap[letter] ? `<b>${letter}</b>` : letter))
    .join('')
}

const FileSearchContainer = ({ owner, repo, branch }) => {
  const { data, isLoading, error } = useQueryFiles({ owner, repo, branch })

  const getFilePathLink = useCallback(
    (filePath) => getFileLink({ filePath, type: 'blob', owner, repo, branch }),
    [owner, repo, branch]
  )

  const [_, send, service] = useMachine(
    createFileSearchMachine({
      getFilePathLink,
      files: [],
    })
  )

  useEffect(() => {
    if (!isLoading && data) {
      send({
        type: 'ON_FILES_UPDATE',
        getFilePathLink,
        files: data?.tree?.filter(({ type }) => type !== 'tree') ?? [],
      })
    }
  }, [isLoading, data])

  if (error) return null

  return <FileSearchModal service={service} isLoading={isLoading} />
}

export default FileSearchContainer

/**
 * @TODO Handle loading status
 */
function FileSearchModal({ service, isLoading }) {
  const [state, send] = useActor(service)

  const classes = useStyles()
  const inputRef = useRef(null)
  const { result = [], keyword = '', selectedIndex = 0 } = state.context
  const isOpened = state.matches('opened')

  useEffect(() => {
    if (inputRef.current && isOpened) {
      inputRef.current.focus()
    }
  }, [inputRef, isOpened])

  const handleClose = () => send('CLOSE')
  const handleInputChange = (e) => {
    e.preventDefault()
    send({ type: 'UPDATE_KEYWORD', input: e.target.value })
  }
  const handleOptionClick = (index) => () => {
    send({ type: 'SELECT_INDEX', index })
  }

  const highlightMap = buildUsedLetterMap(keyword)

  return (
    <Modal
      isOpened={isOpened}
      onClose={handleClose}
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
