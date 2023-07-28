import { useCallback } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import { Connection } from './types'
import { didUserReject } from './utils'
import { useUpdateSelectedWallet } from '~/state/user/hooks'

export enum ActivationStatus {
  PENDING,
  ERROR,
  IDLE,
}

type ActivationPendingState = {
  status: ActivationStatus.PENDING
  connection: Connection
}

type ActivationErrorState = {
  status: ActivationStatus.ERROR
  connection: Connection
  error: any
}

const IDLE_ACTIVATION_STATE = { status: ActivationStatus.IDLE } as const
type ActivationState = ActivationPendingState | ActivationErrorState | typeof IDLE_ACTIVATION_STATE

const activationStateAtom = atom<ActivationState>(IDLE_ACTIVATION_STATE)

function useTryActivation() {
  const updateSelectedWallet = useUpdateSelectedWallet()
  const setActivationState = useSetAtom(activationStateAtom)

  return useCallback(
    async (connection: Connection, onSuccess: () => void) => {
      // Skips wallet connection if the connection should override the default
      // behavior, i.e. install MetaMask or launch Coinbase app
      if (connection.overrideActivate?.()) return

      try {
        setActivationState({ status: ActivationStatus.PENDING, connection })

        console.debug(`Connection activating: ${connection.getName()}`)
        await connection.connector.activate()

        console.debug(`Connection activated: ${connection.getName()}`)
        updateSelectedWallet(connection.type)

        // Clears pending connection state
        setActivationState(IDLE_ACTIVATION_STATE)

        onSuccess()
      } catch (error) {
        // TODO(WEB-3162): re-add special treatment for already-pending injected errors & move debug to after didUserReject() check
        console.debug(`Connection failed: ${connection.getName()}`)
        console.error(error)

        // Gracefully handles errors from the user rejecting a connection attempt
        if (didUserReject(connection, error)) {
          setActivationState(IDLE_ACTIVATION_STATE)
          return
        }

        setActivationState({
          status: ActivationStatus.ERROR,
          connection,
          error,
        })
      }
    },
    [updateSelectedWallet, setActivationState]
  )
}

function useCancelActivation() {
  const setActivationState = useSetAtom(activationStateAtom)
  return useCallback(
    () =>
      setActivationState((activationState) => {
        if (activationState.status !== ActivationStatus.IDLE) activationState.connection.connector.deactivate?.()
        return IDLE_ACTIVATION_STATE
      }),
    [setActivationState]
  )
}

export function useActivationState() {
  const activationState = useAtomValue(activationStateAtom)
  const tryActivation = useTryActivation()
  const cancelActivation = useCancelActivation()

  return { activationState, tryActivation, cancelActivation }
}
