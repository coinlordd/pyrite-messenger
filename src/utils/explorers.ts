import { getChainInfoOrDefault } from '~/constants/chainInfo'

export function getExplorerLink(
  chainId: number | undefined,
  type: 'transaction' | 'address' | 'token',
  data: string,
  subroute?: 'code'
): string {
  const base = getChainInfoOrDefault(chainId).explorer
  switch (type) {
    case 'transaction':
      return `${base}/tx/${data}` + (subroute ? `#${subroute}` : '')
    case 'address':
      return `${base}/address/${data}` + (subroute ? `#${subroute}` : '')
    case 'token':
      return `${base}/token/${data}` + (subroute ? `#${subroute}` : '')
    default:
      return base
  }
}
