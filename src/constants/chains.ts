export enum SupportedChainId {
  MAINNET = 1,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[]

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  return !!chainId && !!SupportedChainId[chainId]
}

/**
 * The chain ID that is used as the default when initializing the application.
 * This is also the chain ID that is used when the user is not on a supported network.
 */
export const FALLBACK_CHAIN_ID = SupportedChainId.MAINNET

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedChainId.MAINNET] as const

export const TESTNET_CHAIN_IDS = [] as const

export type SupportedTestnetChainId = typeof TESTNET_CHAIN_IDS

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [SupportedChainId.MAINNET] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS
