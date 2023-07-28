import { StaticImageData } from 'next/image'
import ethereumLogoUrl from '../assets/images/ethereum-logo.png'

import { SupportedChainId } from './chains'

export const AVERAGE_L1_BLOCK_TIME = 12_000

export enum NetworkType {
  L1,
  L2,
}

interface ChainInfo {
  readonly networkType: NetworkType
  readonly docs: string
  readonly explorer: string
  readonly logo: StaticImageData
  readonly label: string
  readonly nativeCurrency: {
    name: string // e.g. 'Goerli ETH',
    symbol: string // e.g. 'gorETH',
    decimals: number // e.g. 18,
  }
}

type ChainInfoMap = {
  readonly [chainId: number]: ChainInfo
}

const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.MAINNET]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.uniswap.org',
    explorer: 'https://etherscan.io',
    label: 'Ethereum',
    logo: ethereumLogoUrl,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
}

function getChainInfo(chainId: SupportedChainId | undefined): ChainInfo | undefined {
  if (chainId && chainId in CHAIN_INFO) {
    return CHAIN_INFO[chainId]
  }
  return undefined
}

const MAINNET_INFO = CHAIN_INFO[SupportedChainId.MAINNET]
export function getChainInfoOrDefault(chainId: number | undefined): ChainInfo {
  return getChainInfo(chainId) ?? MAINNET_INFO
}
