import { ReactNode, useMemo } from 'react'
import { Connector } from '@web3-react/types'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'

import useEagerlyConnect from '../../hooks/useEagerlyConnect'
import useOrderedConnections from '../../hooks/useOrderedConnections'

export default function Web3Provider({ children }: { children: ReactNode }) {
  // Attempt to eagerly connect to any provider.
  useEagerlyConnect()

  const connections = useOrderedConnections()
  const connectors: [Connector, Web3ReactHooks][] = connections.map(({ hooks, connector }) => [connector, hooks])

  const key = useMemo(() => connections.map((connection) => connection.getName()).join('-'), [connections])

  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      {children}
    </Web3ReactProvider>
  )
}
