import styled from 'styled-components'

export const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  position: relative;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    opacity: 0.7;
  }

  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`
