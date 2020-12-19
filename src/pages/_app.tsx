import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import { AppProps } from 'next/app'

import theme from '../theme'
import { Layout } from '../components/Layout';
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';

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
        login: (_result, _, cache, _) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if(result.login.errors) {
                return query
              } else {
                return {
                  // the return expects a user type due to our helper function
                  me: result.login.user,
                }
              }
            }
          )
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            { query: MeDocument},
            _result,
            (result, query) => {
              if(result.register.errors) {
                return query;
              } else {
                return {
                  me: result.register.user
                }
              }
            }
          )
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
