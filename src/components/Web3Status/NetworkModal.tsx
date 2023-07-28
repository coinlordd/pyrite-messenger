import { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { AlertCircle } from 'react-feather'

import useWeb3React from '~/hooks/useWeb3React'
import { getChainInfoOrDefault } from '~/constants/chainInfo'
import useSelectChain from '~/hooks/useSelectChain'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId, isSupportedChain } from '~/constants/chains'
import { useNetworkModalOpen, useUpdateNetworkModalOpen } from '~/state/application/hooks'

import { Modal } from '../Modal'
import { ColumnStart } from '../Common/Column'
import { RowStart } from '../Common/Row'
import { ButtonLoadingSpinner } from '../Icons/LoadingButtonSpinner'
import { IconWrapper } from '../Icons/IconWrapper'

const Wrapper = styled(ColumnStart)`
  margin: 0 auto;
  gap: 0.8rem;
`

const OptionCard = styled.button<{
  selected: boolean
}>`
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  width: 100% !important;
  padding: 0.6rem;
  border-radius: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textPrimary};

  transition: ${({ theme }) => theme.transition.duration.fast};
  opacity: ${({ disabled, selected }) => (disabled && !selected ? '0.5' : '1')};

  &:focus,
  &:hover {
    cursor: ${({ disabled }) => !disabled && 'pointer'};
    background-color: ${({ theme, disabled }) => !disabled && theme.hoverState};
  }
`

const ErrorCard = styled(RowStart)`
  color: ${({ theme }) => theme.accentCritical};
  background-color: ${({ theme }) => theme.accentFailureSoft};
  font-weight: 700;
  font-size: 0.9rem;
  gap: 0.5rem;
  padding: 0.6rem;
  border-radius: 10px;
`

export function NetworkModal() {
  const { chainId } = useWeb3React()
  const modalOpen = useNetworkModalOpen()
  const toggleNetworkModal = useUpdateNetworkModalOpen()
  const isSupportedChainId = isSupportedChain(chainId)

  const showModal = useMemo(() => modalOpen || !isSupportedChainId, [modalOpen, isSupportedChainId])

  return (
    <Modal isOpen={showModal} title="Select Network" onClose={() => showModal && toggleNetworkModal(false)}>
      <Wrapper>
        {ALL_SUPPORTED_CHAIN_IDS.map((id) => (
          <Option chainId={id} key={id} />
        ))}
        {!isSupportedChainId && (
          <ErrorCard>
            <IconWrapper>
              <AlertCircle size={20} />
            </IconWrapper>
            Chain {chainId} is not supported. Please select a different network from one of the above.
          </ErrorCard>
        )}
      </Wrapper>
    </Modal>
  )
}

function Option({ chainId }: { chainId: SupportedChainId }) {
  const { chainId: currentChainId } = useWeb3React()
  const toggleNetworkModal = useUpdateNetworkModalOpen()
  const selectChain = useSelectChain()
  const [pendingChainId, setPendingChainId] = useState<SupportedChainId | undefined>(undefined)

  const onSelectChain = useCallback(
    async (targetChainId: SupportedChainId) => {
      setPendingChainId(targetChainId)
      const success = await selectChain(targetChainId)
      setPendingChainId(undefined)
      success && toggleNetworkModal(false)
    },
    [selectChain, toggleNetworkModal]
  )

  return (
    <OptionCard
      onClick={() => onSelectChain(chainId)}
      disabled={currentChainId === chainId}
      selected={pendingChainId === chainId}
    >
      {pendingChainId === chainId ? <ButtonLoadingSpinner /> : <div>{getChainInfoOrDefault(chainId).label}</div>}
      <IconWrapper>
        <Image src={getChainInfoOrDefault(chainId).logo} alt="Icon" width={40} height={40} />
      </IconWrapper>
    </OptionCard>
  )
}
