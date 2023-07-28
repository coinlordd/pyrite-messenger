import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

// @ts-ignore
const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  $borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1rem'};
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '16px'};
  border: ${({ border }) => border};
`

export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.backgroundInteractive};
  background-color: ${({ theme }) => theme.backgroundInteractive};
`

export const GrayCard = styled(Card)`
  background-color: ${({ theme }) => theme.backgroundModule};
`

export const DarkGrayCard = styled(Card)`
  background-color: ${({ theme }) => theme.backgroundSurface};
`

export const DarkCard = styled(Card)`
  background-color: ${({ theme }) => theme.backgroundBackdrop};
`
