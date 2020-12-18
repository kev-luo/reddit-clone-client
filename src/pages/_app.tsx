import { ChakraProvider } from '@chakra-ui/react'
import { Provider, createClient } from "urql";
import { AppProps } from 'next/app'

import theme from '../theme'

const client = createClient({ url: "http://localhost:4000/graphql" })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
