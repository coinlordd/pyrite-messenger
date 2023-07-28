import styled, { useTheme } from 'styled-components'
import { GitHub } from 'react-feather'

import { Web3Status } from '../Web3Status'
import ThemeToggle from '~/theme/components/ThemeToggle'
import Logo from './Logo'
import { ButtonSecondary } from '../Common/Button'
import { ExternalLink } from '../Link'

const Nav = styled.nav`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  gap: 7px;
  padding: 0 0.5rem;
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: 2;
`

const LogoWrapper = styled(ButtonSecondary)`
  width: fit-content;
  align-items: center;
  height: 3rem;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  padding: 0.6rem;
  border-radius: 10px;
  color: ${({ theme }) => theme.white};
  font-weight: 500;

  :hover,
  :focus {
    outline: none;
  }
`

export function Navbar() {
  const theme = useTheme()
  return (
    <Nav>
      <Logo />
      <Web3Status />
      <ThemeToggle />
      <ExternalLink href="https://github.com/coinlordd/pyrite-messenger">
        <LogoWrapper>
          <GitHub stroke={theme.textSecondary} />
        </LogoWrapper>
      </ExternalLink>
    </Nav>
  )
}
