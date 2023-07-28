import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import ModalProvider from '~/components/Modal/ModalProvider'
import Layout from '~/components/Layout'
import Popups from '~/components/Popups'
import ThemeProvider, { ThemedGlobalStyle } from '~/theme'
import store, { persistor } from '~/state'
import Updaters from '~/state/updaters'

const Web3Provider = dynamic(() => import('../components/Web3Provider'), {
  ssr: false,
})

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Web3Provider>
          <ThemeProvider>
            <ThemedGlobalStyle />
            <ModalProvider>
              <Updaters />
              <Popups />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ModalProvider>
          </ThemeProvider>
        </Web3Provider>
      </PersistGate>
    </ReduxProvider>
  )
}
