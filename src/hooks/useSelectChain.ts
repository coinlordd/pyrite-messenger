import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'

import { useGetConnection } from '~/connection'
import { SupportedChainId } from '~/constants/chains'
import { updateConnectionError } from '~/state/connection/reducer'
import { useAppDispatch } from '~/state'
import { switchChain } from '~/utils/switchChain'

export default function useSelectChain() {
  const dispatch = useAppDispatch()
  const { connector } = useWeb3React()
  const getConnection = useGetConnection()

  return useCallback(
    async (targetChain: SupportedChainId) => {
      if (!connector) return false

      const connectionType = getConnection(connector).type

      try {
        dispatch(updateConnectionError({ connectionType, error: undefined }))
        await switchChain(connector, targetChain)
        return true
      } catch (error) {
        console.error('Failed to switch networks', error)
        dispatch(updateConnectionError({ connectionType, error: error.message }))
        return false
      }
    },
    [connector, dispatch, getConnection]
  )
}
