import { createAction } from '@reduxjs/toolkit'
import { MessageSent } from './reducer'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export const addTransaction = createAction<{
  chainId: number
  from: string
  hash: string
  summary?: string
  message?: MessageSent
}>('transactions/addTransaction')

export const clearAllTransactions = createAction<{ chainId: number }>('transactions/clearAllTransactions')

export const finalizeTransaction = createAction<{
  chainId: number
  hash: string
  receipt: SerializableTransactionReceipt
}>('transactions/finalizeTransaction')

export const checkedTransaction = createAction<{
  chainId: number
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
