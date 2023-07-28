import { useCallback, useMemo } from 'react'

import { ConnectionType } from '~/connection/types'
import { useAppDispatch, useAppSelector } from '../index'
import { updateSelectedWallet } from './reducer'

function useUserState() {
  return useAppSelector((state) => state.user)
}

export function useSelectedWallet() {
  const user = useUserState()
  return useMemo(() => user.selectedWallet, [user.selectedWallet])
}

export function useUpdateSelectedWallet() {
  const dispatch = useAppDispatch()
  return useCallback((wallet: ConnectionType | undefined) => dispatch(updateSelectedWallet(wallet)), [dispatch])
}
