import Image from 'next/image'
import { styled } from 'styled-components'
import MessengerLogo from '~/assets/svg/messenger-logo.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 80%;
  margin-right: auto;
`

export default function Logo() {
  return (
    <Wrapper>
      <Image src={MessengerLogo} alt="Logo" />
    </Wrapper>
  )
}
