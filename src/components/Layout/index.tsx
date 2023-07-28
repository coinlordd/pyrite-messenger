import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Z_INDEX } from '~/theme/zIndex'
import { RowBetween } from '../Common/Row'
import { Navbar } from './NavBar'

const Container = styled.div`
  padding-top: ${({ theme }) => theme.navHeight}px;
  padding-bottom: ${({ theme }) => theme.navHeight}px;
`

const HeaderWrapper = styled(RowBetween)<{ $transparent?: boolean }>`
  background-color: ${({ theme, $transparent }) => !$transparent && theme.backgroundSurface};
  border-bottom: ${({ theme, $transparent }) => !$transparent && `1px solid ${theme.backgroundOutline}`};
  width: 100%;
  position: fixed;
  top: 0;
  z-index: ${Z_INDEX.dropdown};
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  flex: 1;
  top: ${({ theme }) => theme.navHeight}px;
`

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [scrolledState, setScrolledState] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setScrolledState(false)
  }, [router])

  useEffect(() => {
    const scrollListener = () => {
      setScrolledState(window.scrollY > 0)
    }
    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  const isHeaderTransparent = useMemo(() => !scrolledState, [scrolledState])

  return (
    <Container>
      <HeaderWrapper $transparent={isHeaderTransparent}>
        <Navbar />
      </HeaderWrapper>
      <BodyWrapper>{children}</BodyWrapper>
    </Container>
  )
}
