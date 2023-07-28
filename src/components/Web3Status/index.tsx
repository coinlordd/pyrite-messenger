import { useCallback, useRef, useState } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { darken } from 'polished'
import Image from 'next/image'
import { AlertTriangle, ChevronDown, ExternalLink, X } from 'react-feather'

import { truncateAddress } from '~/utils/address'
import useWeb3React from '~/hooks/useWeb3React'
import { getChainInfoOrDefault } from '~/constants/chainInfo'
import { isSupportedChain } from '~/constants/chains'
import useOnOutsideClick from '~/hooks/useOnOutsideClick'
import { useGetConnection } from '~/connection'
import { AppState, useAppSelector } from '~/state'
import { useUpdateSelectedWallet } from '~/state/user/hooks'
import { getExplorerLink } from '~/utils/explorers'
import { useNetworkModalOpen, useUpdateNetworkModalOpen, useUpdateWalletModalOpen } from '~/state/application/hooks'
import EtherscanLogo from '~/components/Icons/Etherscan'
import { WalletModal } from './WalletModal'
import { ButtonSecondary } from '../Common/Button'
import { NetworkModal } from './NetworkModal'
import { RowEnd } from '../Common/Row'
import { InlineOrDrawerModal } from '../Modal'
import { IconWrapper } from '../Icons/IconWrapper'
import { ColumnStart } from '../Common/Column'
import { useScreenSize } from '~/hooks/useScreenSize'

const Web3StatusGeneric = styled(ButtonSecondary)`
  width: fit-content;
  align-items: center;
  height: 3rem;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;

  :focus {
    outline: none;
  }
`

const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.accentFailure};
  border: 1px solid ${({ theme }) => theme.accentFailure};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.accentFailure)};
  }
`

const Web3StatusConnectWrapper = styled(Web3StatusGeneric)`
  align-items: center;
  background-color: ${({ theme }) => theme.accentActionSoft};
  border: 1px solid transparent;

  color: ${({ theme }) => theme.accentAction};
  :hover {
    color: ${({ theme }) => theme.accentActionSoft};
    stroke: ${({ theme }) => theme.accentActionSoft};
  }

  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => `${duration.fast} color ${timing.in}`};
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{
  $open?: boolean
  $inlineModal?: boolean
}>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.backgroundInteractive};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme.textPrimary};
  ${({ $open, $inlineModal }) =>
    $open &&
    $inlineModal &&
    css`
      border-radius: 10px 10px 0 0;
    `};
`

const NetworkIcon = styled(AlertTriangle)`
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

const ChevronIcon = styled(ChevronDown)<{
  $open: boolean
}>`
  transform: ${({ $open }) => ($open ? 'rotateX(180deg)' : 'rotateX(0deg)')};
  transition: ${({ theme }) => theme.transition.duration.medium} transform;
`

const ModalContainer = styled(RowEnd)`
  width: fit-content;
  gap: 0px;
  overflow: hidden;
`

const ModalWrapper = styled(ColumnStart)`
  overflow: hidden;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 700;
  overflow: hidden;

  & > * {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 0.7rem;
    width: 100%;
    gap: 0.6rem;
    overflow: hidden;

    &:hover {
      background: ${({ theme }) => theme.backgroundInteractive};
      cursor: pointer;
    }
  }
`

export function Web3Status() {
  return (
    <>
      <NetworkStatusInner />
      <Web3StatusInner />
      <WalletModal />
      <NetworkModal />
    </>
  )
}

function Web3StatusInner() {
  const theme = useTheme()
  const { account, connector, chainId } = useWeb3React()
  const getConnection = useGetConnection()
  const connection = getConnection(connector)
  const toggleWalletModal = useUpdateWalletModalOpen()
  const updateSelectedWallet = useUpdateSelectedWallet()
  const isSupported = isSupportedChain(chainId)
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const size = useScreenSize()

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  useOnOutsideClick(ref, () => setIsOpen(false))

  const error = useAppSelector((state: AppState) => state.connection.errorByConnectionType[connection.type])

  const disconnect = useCallback(() => {
    if (connector?.deactivate) {
      connector.deactivate()
    }
    connector.resetState()
    updateSelectedWallet(undefined)
    toggle()
  }, [connector, toggle, updateSelectedWallet])

  if (error && !isSupported) {
    return (
      <Web3StatusError onClick={() => toggleWalletModal(true)}>
        <NetworkIcon />
        Network Error
      </Web3StatusError>
    )
  }

  if (!account) {
    return <Web3StatusConnectWrapper onClick={() => toggleWalletModal(true)}>Connect Wallet</Web3StatusConnectWrapper>
  }

  return (
    <ModalContainer ref={ref}>
      <Web3StatusConnected onClick={toggle} $open={isOpen} $inlineModal={size.upToSmall}>
        <Image src={connection.getIcon()} alt="Icon" width={25} height={25} />
        {truncateAddress(account)}
      </Web3StatusConnected>
      <InlineOrDrawerModal open={isOpen} width={180} offsetY={55}>
        <ModalWrapper>
          <a href={getExplorerLink(chainId, 'address', account)} target="_blank" rel="noopener noreferrer">
            <EtherscanLogo size={14} />
            <div>View on Explorer</div>
            <ExternalLink size={12} style={{ marginLeft: 'auto' }} stroke={theme.textSecondary} />
          </a>
          <div onClick={disconnect}>
            <X size={16} stroke={theme.accentActive} />
            <div>Disconnect Wallet</div>
          </div>
        </ModalWrapper>
      </InlineOrDrawerModal>
    </ModalContainer>
  )
}

function NetworkStatusInner() {
  const { chainId, account } = useWeb3React()
  const isOpen = useNetworkModalOpen()
  const toggleNetworkModal = useUpdateNetworkModalOpen()

  if (!account || !chainId) {
    return null
  }

  return (
    <Web3StatusConnected onClick={() => toggleNetworkModal(true)}>
      <Image src={getChainInfoOrDefault(chainId).logo} alt="Icon" width={25} height={25} />
      <IconWrapper>
        <ChevronIcon $open={isOpen} size={20} />
      </IconWrapper>
    </Web3StatusConnected>
  )
}
