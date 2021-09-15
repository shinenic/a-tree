import styled, { css } from 'styled-components'
import GithubLink from 'components/shared/GithubLink'

const BUTTON_HEIGHT = 40

export const CommitButton = styled.div`
  background: white;
  height: ${BUTTON_HEIGHT}px;
  width: 100%;
  text-align: center;
  padding: 8px;
  transition: background 0.2s;
  cursor: pointer;
  border-bottom: 1px solid #e1e4e8;

  &:hover {
    background: #e1e4e8;
  }
`

export const CommitButtonText = styled.div``

export const MenuContainer = styled.div`
  border: 1px solid #e1e4e8;
  background-color: #fcfcfc;
  top: ${BUTTON_HEIGHT + 10}px;
  z-index: 10;
  position: fixed;

  max-width: 540px;
  min-width: 440px;
  max-height: 50vh;
  overflow-x: hidden;
  overflow-y: auto;

  box-shadow: rgb(15 15 15 / 5%) 0px 0px 0px 1px,
    rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px;

  /* width */
  ::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #bbb;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #888;
  }
`

export const StyledGithubLink = styled(GithubLink)`
  padding: 8px 14px;

  display: block;
  color: block;
  border-top: 1px solid #e1e4e8;

  background-color: ${({ selected }) => (selected ? '#ddd' : 'while')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#ddd' : '#eee')};
    text-decoration: none;
  }

  &:first-child {
    border-top: none;
    font-size: 16px;
    padding: 14px;
  }

  & > div:nth-child(1) {
    color: black;
    font-size: 16px;
  }

  & > div:nth-child(2) {
    color: #333;
    font-size: 14px;
  }

  & > div:nth-child(3) {
    color: #333;
    font-size: 14px;
  }
`

export const CommitDetail = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  margin-top: 4px;

  & > div {
    margin-left: 8px;
  }

  & > div:first-child {
    margin-left: 0;
  }
`

export const Sha = styled.div`
  width: 54px;
  text-align: center;
`

export const IconBox = styled.div`
  position: relative;
  cursor: pointer;
  transition: background;
  margin-left: 8px;

  height: ${({ size = 24 }) => `${size}px`};
  width: ${({ size = 24 }) => `${size}px`};

  padding: 2px;
  border-radius: 4px;

  ${({ isIdle }) =>
    isIdle &&
    css`
      &:hover {
        background-color: #0002;
      }

      &:active {
        background-color: #0004;
      }
    `};

  & > * {
    height: ${({ size = 24 }) => `${size - 4}px`};
    width: ${({ size = 24 }) => `${size - 4}px`};

    position: absolute;
    left: 2px;
    right: 2px;
  }
`
