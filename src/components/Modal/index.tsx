import React from 'react'
import styled from 'styled-components'
import StyledModal from 'styled-react-modal'
import { ChevronLeft, X } from 'react-feather'

import { Z_INDEX } from '~/theme/zIndex'
import { useScreenSize } from '~/hooks/useScreenSize'
import { isMobile } from '~/utils/user-agent'
import { RowBetween } from '../Common/Row'
import { IconWrapper } from '../Icons/IconWrapper'
import { GrayCard } from '../Common/Card'

const Container = StyledModal.styled`
  background: ${({ theme }: { theme: any }) => theme.background};
  border: 1px solid ${({ theme }: { theme: any }) => theme.backgroundOutline};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 10px;
  z-index: ${Z_INDEX.modal};
  width: clamp(250px, 85%,  500px);
  padding: 1rem;
`

const Header = styled(RowBetween)`
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 1rem;

  & > h1 {
    font-size: 1rem;
    font-weight: 600;
  }
`

const StyledInlineModal = styled(GrayCard)<{
  $open: boolean
  $width: number
  $offsetY: number
}>`
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  position: absolute;
  width: ${({ $width }) => $width}px;
  transform: ${({ $offsetY }) => `translateY(${$offsetY}px)`};
  z-index: ${Z_INDEX.modal};
  padding: 0;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  border-radius: 10px 0 10px 10px;
  overflow: hidden;
`

const StyledDrawerModal = styled(GrayCard)<{
  $open: boolean
  $isMobile: boolean
}>`
  display: flex;
  position: fixed;
  bottom: ${({ $open, $isMobile }) => ($open ? ($isMobile ? '25px' : 0) : '-100%')};
  left: 0;
  width: 100%;
  z-index: ${Z_INDEX.modal};
  padding: 0;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  transition: bottom 0.3s cubic-bezier(0.82, 0.085, 0.395, 0.895);
`

export function Modal({
  isOpen,
  title,
  onClose,
  onBack,
  children,
}: {
  isOpen: boolean
  title: string
  onClose: () => void
  onBack?: () => void
  children: React.ReactNode
}) {
  return (
    <Container isOpen={isOpen} onBackgroundClick={onClose} onEscapeKeydown={onClose}>
      <Header>
        {onBack && (
          <IconWrapper>
            <ChevronLeft onClick={onBack} />
          </IconWrapper>
        )}
        <h1>{title}</h1>
        <IconWrapper>
          <X size={16} onClick={onClose} />
        </IconWrapper>
      </Header>
      {children}
    </Container>
  )
}

export function InlineOrDrawerModal({
  open,
  width,
  offsetY,
  children,
}: {
  open: boolean
  width: number
  offsetY: number
  children: React.ReactNode
}) {
  const size = useScreenSize()

  return size.upToSmall ? (
    <InlineModal open={open} width={width} offsetY={offsetY}>
      {children}
    </InlineModal>
  ) : (
    <DrawerModal open={open}>{children}</DrawerModal>
  )
}

export function InlineModal({
  open,
  width,
  offsetY,
  children,
}: {
  open: boolean
  width: number
  offsetY: number
  children: React.ReactNode
}) {
  return (
    <StyledInlineModal $open={open} $width={width} $offsetY={offsetY}>
      {children}
    </StyledInlineModal>
  )
}

export function DrawerModal({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <StyledDrawerModal $open={open} $isMobile={isMobile}>
      {children}
    </StyledDrawerModal>
  )
}
