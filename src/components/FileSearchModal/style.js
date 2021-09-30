import styled from 'styled-components'

export const Input = styled.input`
  margin: 0 8px;
  border-radius: 3px;
  padding: 4px 8px;
  border: 2px solid rgb(33, 130, 172);

  &: focus-visible {
    border-radius: 3px;
    outline-width: 0;
    border: 2px solid rgb(33, 130, 172);
  }
`

export const FileRow = styled.div`
  display: flex;
  align-items: center;
  padding: 3px 16px;
  cursor: pointer;

  background-color: ${({ isSelected, theme }) =>
    isSelected && theme.palette.action.focus};

  b {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }

  &:nth-of-type(1) {
    margin-top: 10px;
  }
`

export const FileName = styled.span`
  font-size: 15x;
  margin-right: 8px;
`

export const FilePath = styled.span`
  font-size: 12px;
`
