import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { Provider, createClient } from "urql";
import { AppProps } from 'next/app'

import theme from '../theme'
import { Layout } from '../components/Layout';

const client = createClient({ url: "http://localhost:4000/graphql", fetchOptions: { credentials: "include" } })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
