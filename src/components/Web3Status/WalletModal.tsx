import { useEffect } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { AlertCircle } from 'react-feather'

import { getConnections, networkConnection } from '~/connection'
import { Connection } from '~/connection/types'
import { ActivationStatus, useActivationState } from '~/connection/activate'
import useWeb3React from '~/hooks/useWeb3React'
import { isSupportedChain } from '~/constants/chains'
import { useWalletModalOpen, useUpdateWalletModalOpen } from '~/state/application/hooks'

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

export function WalletModal() {
  const { connector, chainId } = useWeb3React()
  const connections = getConnections()
  const { activationState } = useActivationState()
  const modalOpen = useWalletModalOpen()
  const toggleWalletModal = useUpdateWalletModalOpen()

  // Keep the network connector in sync with any active user connector to prevent chain-switching on wallet disconnection.
  useEffect(() => {
    if (chainId && isSupportedChain(chainId) && connector !== networkConnection.connector) {
      networkConnection.connector.activate(chainId)
    }
  }, [chainId, connector])

  return (
    <Modal isOpen={modalOpen} title="Connect your Wallet" onClose={() => toggleWalletModal(false)}>
      <Wrapper>
        {connections
          .filter((connection) => connection.shouldDisplay())
          .map((connection) => (
            <Option connection={connection} key={connection.getName()} />
          ))}
        {activationState.status === ActivationStatus.ERROR && (
          <ErrorCard>
            <IconWrapper>
              <AlertCircle size={20} />
            </IconWrapper>
            Connection not established, try connecting again.
          </ErrorCard>
        )}
      </Wrapper>
    </Modal>
  )
}

function Option({ connection }: { connection: Connection }) {
  const { activationState, tryActivation } = useActivationState()
  const toggleWalletModal = useUpdateWalletModalOpen()
  const activate = () => tryActivation(connection, () => toggleWalletModal(false))

  const isSomeOptionPending = activationState.status === ActivationStatus.PENDING
  const isCurrentOptionPending = isSomeOptionPending && activationState.connection.type === connection.type

  return (
    <OptionCard onClick={activate} disabled={isSomeOptionPending} selected={isCurrentOptionPending}>
      {isCurrentOptionPending ? <ButtonLoadingSpinner /> : <div>{connection.getName()}</div>}
      <IconWrapper>
        <Image src={connection.getIcon()} alt="Icon" width={40} height={40} />
      </IconWrapper>
    </OptionCard>
  )
}
