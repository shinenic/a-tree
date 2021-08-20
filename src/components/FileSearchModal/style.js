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
  color: #555;
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 4px;
  background-color: ${({ isSelected }) => (isSelected ? '#ccc' : '#fff')};
  cursor: pointer;

  b {
    color: #222;
  }

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? '#ccc' : '#eee')};
  }

  &:nth-of-type(1) {
    margin-top: 12px;
  }
`

export const FileName = styled.span`
  font-size: 15x;
  margin-right: 8px;
`

export const FilePath = styled.span`
  font-size: 12px;
`
