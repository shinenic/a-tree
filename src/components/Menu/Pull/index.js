import { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { animated } from 'react-spring'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import moment from 'moment'
import * as Style from './style'
import { AiOutlineArrowLeft } from 'react-icons/ai'

import { PJAX_ID } from 'constants/github'

import useClickOutside from 'hooks/useClickOutside'
import usePullMenu from 'hooks/usePullMenu'

const AnimatedMenuContainer = animated(Style.MenuContainer)

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    display: 'block',
    width: '100%',
    height: '40px',
    borderBottom: '1px solid #f1f1f1',
    borderRadius: '0',
    textTransform: 'none',
    background: 'white',
  },
  buttonLabel: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  smallAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

const Pull = ({
  title,
  createdBy,
  createdAt,
  number,
  branchFrom,
  branchTo,
  avatarClassName,
  avatarUrl,
  selected,
  link,
  handleClose,
}) => {
  return (
    <Style.StyledGithubLink
      onClick={handleClose}
      href={link}
      pjaxId={PJAX_ID.PULL}
      selected={selected}
    >
      <div>{title}</div>
      <div>
        <Chip
          label={branchTo}
          // color="primary"
          variant="outlined"
          size="small"
        />
        <AiOutlineArrowLeft />
        <Chip
          label={branchFrom}
          // color="primary"
          variant="outlined"
          size="small"
        />
      </div>
      <Style.CommitDetail>
        <Style.Sha>{`#${number}`}</Style.Sha>
        <Avatar className={avatarClassName} src={avatarUrl} alt={createdBy} />
        <div>{createdBy}</div>
        <div>{moment(createdAt).fromNow()}</div>
      </Style.CommitDetail>
    </Style.StyledGithubLink>
  )
}

export default function PullMenu({ owner, repo, pull }) {
  const classes = useStyles()
  const [menuPositionStyle, setMenuPositionStyle] = useState({})
  const {
    data,
    handleClose,
    handleButtonClick,
    buttonText,
    disabled,
    menuStyles,
  } = usePullMenu({ owner, repo, pull })

  const menuRef = useClickOutside(handleClose)

  useEffect(() => {
    if (!menuRef.current) return

    const buttonRect = menuRef.current.getBoundingClientRect()
    setMenuPositionStyle({
      top: buttonRect.bottom,
      left: buttonRect.left + 20,
    })
  }, [data, pull])

  if (!data) return null

  return (
    <div ref={menuRef}>
      <Button
        disabled={disabled}
        classes={{ root: classes.buttonRoot, label: classes.buttonLabel }}
        onClick={handleButtonClick}
      >
        {buttonText}
      </Button>
      <AnimatedMenuContainer style={{ ...menuStyles, ...menuPositionStyle }}>
        {
          <Style.StyledGithubLink
            onClick={handleClose}
            href={`/${owner}/${repo}/pull/${pull}/files`}
            pjaxId={PJAX_ID.PULL}
          >
            Show all Pull requests
          </Style.StyledGithubLink>
        }
        {data &&
          data.map((pull) => {
            const {
              title,
              user: { login, avatar_url },
              created_at,
              number,
              head,
              base,
              html_url,
            } = pull
            const isSameRepo = repo === head.label.split(':')[0]

            return (
              <Pull
                key={number}
                title={title}
                createdBy={login}
                createdAt={created_at}
                number={number}
                avatarUrl={avatar_url}
                branchFrom={isSameRepo ? head.ref : head.label}
                branchTo={isSameRepo ? base.ref : base.label}
                selected={number === pull}
                avatarClassName={classes.smallAvatar}
                link={html_url}
                handleClose={handleClose}
              />
            )
          })}
      </AnimatedMenuContainer>
    </div>
  )
}
