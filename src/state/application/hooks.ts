import { useCallback, useMemo } from 'react'
import { AppState, useAppDispatch, useAppSelector } from '~/state'

import useWeb3React from '~/hooks/useWeb3React'
import { addPopup, removePopup, setOpenModal } from './actions'
import { ApplicationModal, Popup, PopupContent, PopupList } from './reducer'

export function useBlockNumber(): number | undefined {
  const { chainId } = useWeb3React()
  return useAppSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useAppSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useWalletModalOpen(): boolean {
  return useModalOpen(ApplicationModal.WALLET)
}

export function useNetworkModalOpen(): boolean {
  return useModalOpen(ApplicationModal.NETWORK)
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useUpdateWalletModalOpen() {
  const dispatch = useAppDispatch()
  return useCallback((open: boolean) => dispatch(setOpenModal(open ? ApplicationModal.WALLET : null)), [dispatch])
}

export function useUpdateNetworkModalOpen() {
  const dispatch = useAppDispatch()
  return useCallback((open: boolean) => dispatch(setOpenModal(open ? ApplicationModal.NETWORK : null)), [dispatch])
}

export function useAddPopup(): (content: PopupContent, key?: string, removeAfterMs?: number) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (content: PopupContent, key?: string, removeAfterMs?: number) => {
      dispatch(addPopup({ content, key, removeAfterMs: removeAfterMs ?? 10_000 }))
    },
    [dispatch]
  )
}

export function useRemovePopup(): (key: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

export function useActivePopups(): PopupList {
  const list = useAppSelector((state: AppState) => {
    return state.application.popupList
  })
  return useMemo(() => list.filter((item: Popup) => item.show), [list])
}
