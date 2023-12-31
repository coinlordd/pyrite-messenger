import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect-v2'
import type { Connector } from '@web3-react/types'
import { Connection, ConnectionType } from './types'

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask'
  if (connector instanceof WalletConnect) return 'WalletConnect'
  if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet'
  if (connector instanceof Network) return 'Network'
  if (connector instanceof GnosisSafe) return 'Gnosis Safe'
  return 'Unknown'
}

export const getIsInjected = () => Boolean(window.ethereum)

// When using Brave browser, `isMetaMask` is set to true when using the built-in wallet
// This variable should be true only when using the MetaMask extension
// https://wallet-docs.brave.com/ethereum/wallet-detection#compatability-with-metamask
type NonMetaMaskFlag = 'isRabby' | 'isBraveWallet' | 'isTrustWallet' | 'isLedgerConnect'
const allNonMetamaskFlags: NonMetaMaskFlag[] = ['isRabby', 'isBraveWallet', 'isTrustWallet', 'isLedgerConnect']

export const getIsMetaMaskWallet = () =>
  Boolean(window.ethereum?.isMetaMask && !allNonMetamaskFlags.some((flag) => window.ethereum?.[flag]))

export const getIsCoinbaseWallet = () => Boolean(window.ethereum?.isCoinbaseWallet)

// https://eips.ethereum.org/EIPS/eip-1193#provider-errors
export enum ErrorCode {
  USER_REJECTED_REQUEST = 4001,
  UNAUTHORIZED = 4100,
  UNSUPPORTED_METHOD = 4200,
  DISCONNECTED = 4900,
  CHAIN_DISCONNECTED = 4901,

  // https://docs.metamask.io/guide/rpc-api.html#unrestricted-methods
  CHAIN_NOT_ADDED = 4902,
  MM_ALREADY_PENDING = -32002,

  WC_MODAL_CLOSED = 'Error: User closed modal',
  CB_REJECTED_REQUEST = 'Error: User denied account authorization',
}

// TODO(WEB-3279): merge this function with existing didUserReject for Swap errors
export function didUserReject(connection: Connection, error: any): boolean {
  return (
    error?.code === ErrorCode.USER_REJECTED_REQUEST ||
    (connection.type === ConnectionType.WALLET_CONNECT && error?.toString?.() === ErrorCode.WC_MODAL_CLOSED) ||
    (connection.type === ConnectionType.COINBASE_WALLET && error?.toString?.() === ErrorCode.CB_REJECTED_REQUEST)
  )
}
