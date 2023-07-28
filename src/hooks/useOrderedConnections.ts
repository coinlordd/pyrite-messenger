import { useMemo } from 'react'

import { useGetConnection } from '~/connection/index'
import { ConnectionType } from '~/connection/types'
import { useSelectedWallet } from '~/state/user/hooks'

const SELECTABLE_WALLETS = [
  ConnectionType.INJECTED,
  ConnectionType.WALLET_CONNECT,
  ConnectionType.COINBASE_WALLET,
  ConnectionType.GNOSIS_SAFE,
]

export default function useOrderedConnections() {
  const getConnection = useGetConnection()
  const selectedWallet = useSelectedWallet()

  return useMemo(() => {
    const orderedConnectionTypes: ConnectionType[] = []

    // Always attempt to use to Gnosis Safe first, as we can't know if we're in a SafeContext.
    orderedConnectionTypes.push(ConnectionType.GNOSIS_SAFE)

    // Add the `selectedWallet` to the top so it's prioritized, then add the other selectable wallets.
    if (selectedWallet) {
      orderedConnectionTypes.push(selectedWallet)
    }
    orderedConnectionTypes.push(...SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet))

    // Add network connection last as it should be the fallback.
    orderedConnectionTypes.push(ConnectionType.NETWORK)

    return orderedConnectionTypes.map((connectionType) => getConnection(connectionType))
  }, [getConnection, selectedWallet])
}
