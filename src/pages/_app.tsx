import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import { AppProps } from 'next/app'

import theme from '../theme'
import { Layout } from '../components/Layout';
import { MeDocument } from '../generated/graphql';

// function to properly cast types
function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: "http://localhost:4000/graphql", fetchOptions: { credentials: "include" }, exchanges: [dedupExchange, fetchExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (result, args, cache, info) => {
          cache.updateQuery({ query: MeDocument}, data => {
            if(data) return data;
          })
        }
      }
    }
  })],
})

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
