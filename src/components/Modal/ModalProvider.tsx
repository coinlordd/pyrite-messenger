import styled from 'styled-components'
import { ModalProvider as Provider } from 'styled-react-modal'

import { Z_INDEX } from '~/theme/zIndex'
import { ReactNode } from 'react'

const ModalBackground = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${Z_INDEX.modalBackdrop};
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(1px);
  justify-content: center;
`

export default function ModalProvider({ children }: { children: ReactNode }) {
  // @ts-ignore
  return <Provider backgroundComponent={ModalBackground}>{children}</Provider>
}
