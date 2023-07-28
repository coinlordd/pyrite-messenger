import { Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { StaticImageData } from 'next/image'

export enum ConnectionType {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
}

export interface Connection {
  getName(): string
  getIcon(): StaticImageData
  connector: Connector
  hooks: Web3ReactHooks
  type: ConnectionType
  shouldDisplay(): boolean
  overrideActivate: () => boolean
}
