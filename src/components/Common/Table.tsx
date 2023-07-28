import styled from 'styled-components'

export const TableWrapper = styled.div`
  overflow-y: scroll;
  padding: 0rem 1rem 1rem 1rem;
  font-variant-numeric: tabular-nums;
`

export const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
`

export const Head = styled.thead`
  & > tr {
    height: 30px;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textPrimary};
    &:hover {
      cursor: pointer;
    }
  }
`

export const Row = styled.tr<{
  opacity?: number
  warn?: boolean
}>`
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.7rem;
  height: 2.1rem;
  border-bottom: 1px solid ${({ theme }) => theme.backgroundOutline};
  background: ${({ theme, warn }) => (warn ? theme.accentFailureSoft : 'inherit')};
  &:hover {
    cursor: pointer;
    background: ${({ theme, warn }) => (warn ? theme.accentCritical : theme.backgroundInteractive)};
  }
  opacity: ${({ opacity }) => opacity ?? 1};
`

export const EmptyRow = styled.td`
  text-align: center;
  padding: 1.25rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
`

export const Cell = styled.td<{
  align?: 'left' | 'right' | 'center'
}>`
  text-align: ${({ align }) => align || 'left'};
  text-overflow: ellipsis;
  align-items: center;

  #status {
    display: inline-flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }
`

export const HeaderCell = styled(Cell).attrs({
  as: 'th',
})<{
  dotted?: boolean
}>`
  ${({ dotted, theme }) =>
    dotted &&
    `
    text-decoration: underline;
    text-decoration-style: dotted;
    text-decoration-color: ${theme.backgroundModule};
    text-underline-offset: 3px;
  `}
`
