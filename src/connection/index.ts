import { useCallback } from 'react'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { WalletConnect } from '@web3-react/walletconnect-v2'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Connector } from '@web3-react/types'

import COINBASE_ICON from '../assets/svg/coinbase_wallet.svg'
import GNOSIS_ICON from '../assets/images/gnosis.png'
import METAMASK_ICON from '../assets/svg/metamask.svg'
import WALLET_CONNECT_ICON from '../assets/svg/wallet_connect.svg'
import INJECTED_ICON from '../assets/svg/browser_wallet_dark.svg'

import { SupportedChainId, L1_CHAIN_IDS } from '../constants/chains'
import { RPC_URLS } from '../constants/networks'
import { RPC_PROVIDERS } from '../constants/providers'
import { isMobile } from '../utils/user-agent'
import { Connection, ConnectionType } from './types'
import { getIsCoinbaseWallet, getIsInjected, getIsMetaMaskWallet } from './utils'

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  (actions) => new Network({ actions, urlMap: RPC_PROVIDERS, defaultChainId: 1 })
)
export const networkConnection: Connection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
  getName: () => 'Network',
  getIcon: () => METAMASK_ICON,
  shouldDisplay: () => false,
  overrideActivate: () => false,
}

const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet()
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet()
const getIsInjectedMobileBrowser = () => getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser()

const getShouldAdvertiseMetaMask = () =>
  !getIsMetaMaskWallet() && !isMobile && (!getIsInjected() || getIsCoinbaseWallet())
const getIsGenericInjector = () => getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet()

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions, onError }))

const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
  // TODO(WEB-3131) re-add "Install MetaMask" string when no injector is present
  getName: () => (getIsGenericInjector() ? 'Browser Wallet' : 'MetaMask'),
  getIcon: () => (getIsGenericInjector() ? INJECTED_ICON : METAMASK_ICON),
  shouldDisplay: () => getIsMetaMaskWallet() || getShouldAdvertiseMetaMask() || getIsGenericInjector(),
  // If on non-injected, non-mobile browser, prompt user to install Metamask
  overrideActivate: () => {
    if (getShouldAdvertiseMetaMask()) {
      window.open('https://metamask.io/', 'inst_metamask')
      return true
    }
    return false
  },
}

const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>((actions) => new GnosisSafe({ actions }))
export const gnosisSafeConnection: Connection = {
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
  getName: () => 'Gnosis Safe',
  getIcon: () => GNOSIS_ICON,
  shouldDisplay: () => false,
  overrideActivate: () => false,
}

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw Error('ENV value for NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined!')
}
const WALLET_CONNECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

const [mainnet, ...optionalChains] = Object.keys(L1_CHAIN_IDS).map(Number)
const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        projectId: WALLET_CONNECT_ID,
        chains: [mainnet],
        optionalChains,
        showQrModal: true,
      },
    })
)
export const walletConnectConnection: Connection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
  getName: () => 'WalletConnect',
  getIcon: () => WALLET_CONNECT_ICON,
  shouldDisplay: () => !getIsInjectedMobileBrowser(),
  overrideActivate: () => false,
}

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: RPC_URLS[SupportedChainId.MAINNET][0],
        appName: 'Coinbase Wallet',
        appLogoUrl: COINBASE_ICON,
        reloadOnDisconnect: false,
      },
      onError,
    })
)

const coinbaseWalletConnection: Connection = {
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
  getName: () => 'Coinbase Wallet',
  getIcon: () => COINBASE_ICON,
  shouldDisplay: () =>
    Boolean((isMobile && !getIsInjectedMobileBrowser()) || !isMobile || getIsCoinbaseWalletBrowser()),
  // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
  overrideActivate: () => {
    if (isMobile && !getIsInjectedMobileBrowser()) {
      window.open('https://go.cb-w.com/mtUDhEZPy1', 'cbwallet')
      return true
    }
    return false
  },
}

export function getConnections() {
  return [
    injectedConnection,
    walletConnectConnection,
    coinbaseWalletConnection,
    gnosisSafeConnection,
    networkConnection,
  ]
}

export function useGetConnection() {
  return useCallback((c: Connector | ConnectionType) => {
    if (c instanceof Connector) {
      const connection = getConnections().find((connection) => connection.connector === c)
      if (!connection) {
        throw Error('unsupported connector')
      }
      return connection
    } else {
      switch (c) {
        case ConnectionType.INJECTED:
          return injectedConnection
        case ConnectionType.COINBASE_WALLET:
          return coinbaseWalletConnection
        case ConnectionType.WALLET_CONNECT:
          return walletConnectConnection
        case ConnectionType.NETWORK:
          return networkConnection
        case ConnectionType.GNOSIS_SAFE:
          return gnosisSafeConnection
      }
    }
  }, [])
}
