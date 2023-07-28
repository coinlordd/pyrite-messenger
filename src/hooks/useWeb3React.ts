import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { getAddress } from '@ethersproject/address'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { FALLBACK_CHAIN_ID } from '~/constants/chains'

function useImpersonatedAccount(): string | undefined {
  const query = useRouter()
  return useMemo(() => {
    if (typeof query.query.impersonate == 'string') {
      try {
        return getAddress(query.query.impersonate)
      } catch (err) {
        return undefined
      }
    }
    return undefined
  }, [query])
}

export default function useWeb3React(): ReturnType<typeof useWeb3ReactCore> & {
  chainId: number
} {
  const injected = useWeb3ReactCore()
  const account = useImpersonatedAccount()
  return useMemo(
    () => ({
      ...injected,
      account: account ?? injected.account,
      chainId: injected.chainId ?? FALLBACK_CHAIN_ID,
    }),
    [injected, account]
  )
}
