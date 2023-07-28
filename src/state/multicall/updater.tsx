import { useMemo } from 'react'
import { ListenerOptions } from '@uniswap/redux-multicall'
import { useWeb3React } from '@web3-react/core'

import { useInterfaceMulticall } from '~/hooks/useContract'
import { useBlockNumber } from '~/state/application/hooks'
import multicall from './reducer'

function getBlocksPerFetchForChainId(chainId: number | undefined): number {
  switch (chainId) {
    default:
      return 1
  }
}

export default function MulticallUpdater() {
  const { chainId } = useWeb3React()
  const latestBlockNumber = useBlockNumber()
  const contract = useInterfaceMulticall()
  const listenerOptions: ListenerOptions = useMemo(
    () => ({
      blocksPerFetch: getBlocksPerFetchForChainId(chainId),
    }),
    [chainId]
  )

  return (
    <multicall.Updater
      chainId={chainId}
      latestBlockNumber={latestBlockNumber}
      contract={contract}
      listenerOptions={listenerOptions}
    />
  )
}
