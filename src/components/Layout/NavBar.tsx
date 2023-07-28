import styled from 'styled-components'

import { Web3Status } from '../Web3Status'
import ThemeToggle from '~/theme/components/ThemeToggle'
import Logo from './Logo'

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

export function Navbar() {
  return (
    <Nav>
      <Logo />
      <Web3Status />
      <ThemeToggle />
    </Nav>
  )
}
