import { dedupExchange, fetchExchange } from "urql"
import { cacheExchange } from "@urql/exchange-graphcache";
import { LoginMutation, MeQuery, MeDocument, LogoutMutation, RegisterMutation } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery";

export const urqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql", fetchOptions: { credentials: "include" as const }, exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          // we're updating the MeQuery and sticking the user in there
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.login.errors) {
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
        logout: (_result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            () => ({ me: null })
          )
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.register.errors) {
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
  }), ssrExchange, fetchExchange],
})