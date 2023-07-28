import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: 100%;
`

export const RowStart = styled(Row)`
  justify-content: flex-start;
`

export const RowBetween = styled(Row)`
  justify-content: space-between;
`

export const RowEnd = styled(Row)`
  justify-content: flex-end;
`

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`
