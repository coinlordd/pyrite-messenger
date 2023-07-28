import React from 'react'
import styled, { useTheme } from 'styled-components'

import useWeb3React from '~/hooks/useWeb3React'
import { Check, Info, X } from 'react-feather'
import { getExplorerLink } from '~/utils/explorers'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem 1.25rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: ${({ theme }) => theme.textSecondary};
`

const SuccessBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
  margin-top: 1rem;
  background: ${({ theme }) => theme.backgroundInteractive};
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  border-radius: 10px;
  height: 2rem;
  padding: 0.8rem;
  font-size: 0.8rem;
  line-height: 2rem;
  color: ${({ theme }) => theme.textSecondary};

  & > * {
    &:first-child {
      margin-right: 0.5rem;
    }
    &:last-child {
      margin-left: auto;
    }
  }
`

export default function TransactionPopup({
  hash,
  success,
  summary,
  removeThisPopup,
}: {
  hash: string
  success?: boolean
  summary?: string
  removeThisPopup: () => void
}) {
  const { chainId } = useWeb3React()
  const theme = useTheme()

  const getHeader = () => {
    return (
      <Header>
        {summary}
        <X size={16} onClick={removeThisPopup} />
      </Header>
    )
  }

  const getBox = () => {
    return (
      <a href={getExplorerLink(chainId, 'transaction', hash)} target="_blank" rel="noopener noreferrer">
        <SuccessBox color={success ? theme.success : theme.error}>
          <Check size={16} color={success ? theme.accentSuccess : theme.accentFailure} />
          Transaction {success ? 'successful' : 'failed'}
          <Info size={12} color={theme.textPrimary} />
        </SuccessBox>
      </a>
    )
  }

  return (
    <Wrapper>
      {getHeader()}
      {getBox()}
    </Wrapper>
  )
}
