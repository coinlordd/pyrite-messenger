import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { formatUnits, parseEther } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'
import { hexlify } from '@ethersproject/bytes'
import { toUtf8Bytes } from '@ethersproject/strings'

import PyriteMap from '~/assets/images/pyrite-map.jpg'
import MailingList from '~/assets/svg/mailing-list-logo.svg'
import { ColumnStart } from '~/components/Common/Column'
import { RowBetween, RowStart } from '~/components/Common/Row'
import useWeb3React from '~/hooks/useWeb3React'
import { ButtonPrimary } from '~/components/Common/Button'
import { useERC20Contract } from '~/hooks/useContract'
import hooks from '~/state/multicall/hooks'
import { useAddPopup, useBlockNumber } from '~/state/application/hooks'
import { useHasSentMessage, useIsTransactionPending, useTransactionAdder } from '~/state/transactions/hooks'

const Container = styled(ColumnStart)`
  width: 70%;
  margin: 0 auto;
  padding-top: 2rem;
  gap: 1rem;

  * {
    font-family: 'Inria Serif';
  }
`

const Hero = styled(RowStart)`
  justify-content: center;
`

const TextArea = styled.textarea`
  width: 100%;
  resize: vertical;
  border-radius: 10px;
  padding: 0.7rem;
  background: ${({ theme }) => theme.backgroundInteractive};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.textSecondary};
`

const NameBox = styled(TextArea)`
  padding: 0;
  padding-left: 0.7rem;
  height: 3rem;
  line-height: 3rem;
  resize: none;
`

const MessageBox = styled(TextArea)`
  height: 8rem;
`

const DestinationContainer = styled(ColumnStart)`
  width: 100%;
  gap: 4px;

  & > * {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    :last-child {
      margin-left: auto;
    }
  }
`

const SendButton = styled(ButtonPrimary)`
  width: fit-content;
  padding: 0.3rem 1rem;
  font-size: 1rem;
`

const Address = styled.div`
  font-variant-numeric: tabular-nums;
`

function useTokenBalance(address: string, decimals: number) {
  const contract = useERC20Contract(address, false)
  const { chainId, account } = useWeb3React()
  const blockNumber = useBlockNumber()
  const balance = hooks.useSingleCallResult(chainId, blockNumber, contract, 'balanceOf', [account])
  return useMemo(() => (balance.result ? formatUnits(balance.result[0], decimals) : '0'), [balance.result, decimals])
}

type MessageData = {
  name: string
  from: string
  message: string
  pyriteBalance: string
  boneBalance: string
  shibBalance: string
}

export default function Index() {
  const { account } = useWeb3React()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [messageData, setMessageData] = useState({
    name: '',
    from: '',
    message: '',
    pyriteBalance: '',
    boneBalance: '',
    shibBalance: '',
  })

  const pyriteBalance = useTokenBalance('0x026ade9ba164881c80de6d49580193c3528303db', 18)
  const boneBalance = useTokenBalance('0x9813037ee2218799597d83D4a5B6F3b6778218d9', 18)
  const shibBalance = useTokenBalance('0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', 18)

  useEffect(() => {
    if (!account) return
    setMessageData({
      name,
      from: account,
      message,
      pyriteBalance,
      boneBalance,
      shibBalance,
    })
  }, [name, account, message, pyriteBalance, boneBalance, shibBalance])

  return (
    <Container>
      <Hero>
        <Image src={MailingList} alt="Mailing List" />
      </Hero>
      <NameBox value={name} onChange={(e) => setName(e.target.value)} placeholder={'Your name...'} />
      <MessageBox value={message} onChange={(e) => setMessage(e.target.value)} placeholder={'Write your message...'} />
      <DestinationContainer>
        {data.map((destination) => (
          <DestinationRow key={destination.address} destination={destination} messageData={messageData} />
        ))}
      </DestinationContainer>
      <Image src={PyriteMap} alt="Pyrite Map" />
    </Container>
  )
}

function calculateGasMargin(value: BigNumber) {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}

function DestinationRow({ destination, messageData }: { destination: Destination; messageData: MessageData }) {
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [txHash, setTxHash] = useState('')
  const { account, hooks } = useWeb3React()
  const provider = hooks.usePriorityProvider()
  const txPending = useIsTransactionPending(txHash)
  const messageSent = useHasSentMessage(destination.address)
  const addTransaction = useTransactionAdder()
  const addPopup = useAddPopup()

  const hexEncodedMessage = useMemo(() => {
    const text =
      'Name: ' +
      messageData.name +
      '\n' +
      'From: ' +
      messageData.from +
      '\n' +
      'To: ' +
      destination.address +
      '\n\n' +
      'Message: ' +
      '\n' +
      messageData.message +
      '\n\n' +
      'Pyrite Balance: ' +
      messageData.pyriteBalance +
      '\n' +
      'Bone Balance: ' +
      messageData.boneBalance +
      '\n' +
      'Shib Balance: ' +
      messageData.shibBalance
    return hexlify(toUtf8Bytes(text))
  }, [messageData])

  const onSendMessage = useCallback(async () => {
    try {
      setAwaitingConfirmation(true)
      if (!provider || !account) throw new Error('Not connected')
      if (!messageData.name.length || !messageData.message.length) throw new Error('Message is empty')
      if (txPending || messageSent) throw new Error('Message is pending or already sent')

      const signer = provider.getSigner()
      const transaction = {
        from: account,
        to: destination.address,
        value: parseEther('0'),
        data: hexEncodedMessage,
      }

      const estimatedGas = await signer.estimateGas(transaction)
      const response = await signer.sendTransaction({
        ...transaction,
        gasLimit: calculateGasMargin(estimatedGas),
      })

      setTxHash(response.hash)
      addTransaction(response, {
        message: {
          message: messageData.message,
          recipient: destination.address,
        },
      })
      setAwaitingConfirmation(false)
      addPopup({
        txn: {
          hash: response.hash,
          summary: `Message sent to ${destination.tag}`,
          success: true,
        },
      })
    } catch (err) {
      setAwaitingConfirmation(false)
      console.error(err)
    }
  }, [provider, account, messageData, txPending, messageSent, destination, hexEncodedMessage, addTransaction, addPopup])

  return (
    <RowBetween>
      <div>{destination.tag}</div>
      <Address>{destination.address}</Address>
      <SendButton onClick={onSendMessage} disabled={messageSent || destination.disabled}>
        {awaitingConfirmation
          ? 'Awaiting... '
          : txPending
          ? 'Sending...'
          : messageSent
          ? 'Already messaged'
          : destination.disabled
          ? 'Not possible'
          : 'Send'}
      </SendButton>
    </RowBetween>
  )
}

const data: Array<Destination> = [
  {
    address: '0xCd84b0e3Ec7753C3aeEC1DB97EAd614C1c182205',
    disabled: false,
    tag: 'Pyrite Developer',
  },
  {
    address: '0x220866B1A2219f40e72f5c628B65D54268cA3A9D',
    disabled: true,
    tag: 'VB 3',
  },
  {
    address: '0x7da82C7AB4771ff031b66538D2fB9b0B047f6CF9',
    disabled: false,
    tag: 'Golem multisig',
  },
  {
    address: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
    disabled: true,
    tag: 'Beacon deposit Contract',
  },
  {
    address: '0xB8f226dDb7bC672E27dffB67e4adAbFa8c0dFA08',
    disabled: false,
    tag: 'Shib deployer',
  },
  {
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    disabled: true,
    tag: 'Uniswap Router',
  },
  {
    address: '0x000000000000000000000000000000000000dEaD',
    disabled: false,
    tag: 'Dead wallet',
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    disabled: false,
    tag: 'Burn wallet',
  },
  {
    address: '0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF',
    disabled: true,
    tag: 'Tornado cash',
  },
  {
    address: '0xe9f7eCAe3A53D2A67105292894676b00d1FaB785',
    disabled: false,
    tag: 'Kraken hot wallet',
  },
]

type Destination = {
  address: string
  disabled: boolean
  tag: string
}
