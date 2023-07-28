import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider, JsonRpcSigner } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { Connector } from '@web3-react/types'

import useWeb3React from './useWeb3React'
import { MULTICALL_ADDRESS } from '~/constants/addresses'
import { isAddress } from '~/utils/address'
import { getName } from '~/connection/utils'
import { UNISWAP_INTERFACE_MULTICALL, ERC20 } from '~/abi/types'
import UNISWAP_INTERFACE_MULTICALL_ABI from '~/constants/abi/UNISWAP_INTERFACE_MULTICALL.json'
import ERC20_ABI from '~/constants/abi/ERC20.json'

function getSigner(provider: Web3Provider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked()
}

function getProviderOrSigner(provider: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider
}

export function getContract(
  address: string,
  ABI: any,
  provider: Web3Provider,
  connector: Connector,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  let contract = new Contract(address, ABI, getProviderOrSigner(provider, account) as any)
  if (getName(connector) !== 'Network') {
    const signer = provider?.getSigner?.()
    if (signer !== undefined) contract = contract.connect(signer)
  }

  return contract
}

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { account, chainId, hooks } = useWeb3React()
  const connector = hooks.usePriorityConnector()
  const provider = hooks.usePriorityProvider()

  return useMemo(() => {
    try {
      if (!addressOrAddressMap || !provider || !chainId) return null
      let address: string | undefined
      if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
      else address = addressOrAddressMap[chainId]
      if (!address) return null

      const contract = getContract(
        address,
        ABI,
        provider,
        connector,
        withSignerIfPossible && account ? account : undefined
      )
      return contract
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, provider, chainId, account, connector, withSignerIfPossible]) as T
}

export function useInterfaceMulticall() {
  return useContract<UNISWAP_INTERFACE_MULTICALL>(MULTICALL_ADDRESS, UNISWAP_INTERFACE_MULTICALL_ABI, false)
}

export function useERC20Contract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<ERC20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}
