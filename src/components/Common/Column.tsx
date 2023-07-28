import styled, { DefaultTheme } from 'styled-components'

type Gap = keyof DefaultTheme['grids']

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  width: 100%;
`

export const ColumnStart = styled(Column)`
  justify-content: flex-start;
`

export const ColumnBetween = styled(Column)`
  justify-content: space-between;
`

export const ColumnEnd = styled(Column)`
  justify-content: flex-end;
`

export const AutoColumn = styled.div<{
  gap?: Gap | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
  grow?: true
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap, theme }) => (gap && theme.grids[gap as Gap]) || gap};
  justify-items: ${({ justify }) => justify && justify};
  flex-grow: ${({ grow }) => grow && 1};
`
