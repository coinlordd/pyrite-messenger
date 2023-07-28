import { useCallback, useMemo } from 'react'

import { useAppDispatch, useAppSelector } from '~/state'
import useWeb3React from '~/hooks/useWeb3React'

import { addTransaction } from './actions'
import { MessageSent, TransactionDetails, TransactionState } from './reducer'

export interface TransactionResponseLight {
  hash: string
}

export function useTransactionAdder(): (
  response: TransactionResponseLight,
  customData?: {
    summary?: string
    message?: MessageSent
  }
) => void {
  const { chainId, account } = useWeb3React()
  const dispatch = useAppDispatch()

  return useCallback(
    (
      response: TransactionResponseLight,
      {
        summary,
        message,
      }: {
        summary?: string
        message?: MessageSent
      } = {}
    ) => {
      if (!account || !chainId) return

      const { hash } = response
      if (!hash) {
        throw new Error('No transaction hash found.')
      }

      dispatch(
        addTransaction({
          hash,
          from: account,
          chainId,
          summary,
          message,
        })
      )
    },
    [dispatch, chainId, account]
  )
}

// Returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId } = useWeb3React()

  const state: TransactionState = useAppSelector((state) => state.transactions)
  return chainId ? state[chainId] ?? {} : {}
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86400000
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions()
  if (!transactionHash || !transactions[transactionHash]) return false
  return !transactions[transactionHash].receipt
}

export function useHasSentMessage(recipient: string): boolean {
  const allTransactions = useAllTransactions()

  return useMemo(
    () =>
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        const message = tx.message
        if (!message) return false
        return message.recipient === recipient
      }),
    [allTransactions, recipient]
  )
}
