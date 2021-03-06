import { gql } from "@urql/core";
import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import Router from "next/router";
import { dedupExchange, Exchange, fetchExchange, stringifyVariables } from "urql";
import { pipe, tap } from "wonka";
import { DeletePostMutationVariables, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables } from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { isServer } from "./isServer";

// global error handler
const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      }
    })
  )
}

// this is basically a fxn that returns a resolver
const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    // this will inspect all of a certain type of request in the cache. in this case it's inspecting all the queries in the cache since it was called by a client side query resolver.
    // allFields contains separates queries based on name and arguments
    const allFields = cache.inspectFields(entityKey);
    // this makes sure we're only looking at the query that the resolver called. in this case we're only concerned with the posts query
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // when this is passed, urql is going to know we didn't pass through all the data so it's going to fetch the rest of the data from the server
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    )
    info.partial = !isInCache

    const results: string[] = [];
    // combining all queries of the same name but with different arguments (eg posts queries with different limit args combined into a single result)
    let hasMore = true;
    fieldInfos.forEach(fieldInfo => {
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    })
    // returning results means there's data in the cache so we need to tell urql when to do a query
    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

const invalidateAllPosts = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter(info => info.fieldName === "posts");
  fieldInfos.forEach((fieldInfo) => {
    // invalidate cache and refetch posts
    cache.invalidate("Query", "posts", fieldInfo.arguments || {})
  })
}

export const urqlClient = (ssrExchange: any, ctx: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: () => {
    let cookie = "";
    if (isServer()) {
      cookie = ctx?.req?.headers?.cookie;
    }
    return {
      credentials: "include" as const,
      headers: cookie ? {
        cookie
      } : undefined
    }
  },
  exchanges: [dedupExchange, cacheExchange({
    keys: {
      PaginatedPosts: () => null,
    },
    resolvers: {
      Query: {
        // this is a client side resolver. cursorPagination() gets run whenever the posts query gets run
        posts: cursorPagination(),
      }
    },
    updates: {
      Mutation: {
        login: (_result, _args, cache, _info) => {
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
          invalidateAllPosts(cache);
        },
        logout: (_result, _args, cache, _info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            () => ({ me: null })
          )
        },
        register: (_result, _args, cache, _info) => {
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
        },
        createPost: (_result, _args, cache, _info) => {
          invalidateAllPosts(cache);
        },
        vote: (_result, args, cache, _info) => {
          // get type information
          const { postId, value } = args as VoteMutationVariables
          // posts with correct postId will be updated wherever they're displayed
          const data = cache.readFragment(gql`
            fragment _ on Post {
              id
              points
              voteStatus
            }
          `, { id: postId })
          // if there is data from the cache
          if (data) {
            if (data.voteStatus === value) {
              return;
            }
            const newPoints = (data.points as number) + (data.voteStatus ? 2 : 1) * value

            cache.writeFragment(
              gql`
                fragment __ on Post {
                  points
                  voteStatus
                }
              `,
              { id: postId, points: newPoints, voteStatus: value }
            )
          }
        },
        // returns null for post that got deleted, therefore added a ternary in homepage in the map fxn to check if each post in the posts array contains a post.
        deletePost: (_result, args, cache, _info) => {
          const { id } = args as DeletePostMutationVariables
          cache.invalidate({ __typename: "Post", id })
        }
      }
    }
  }), errorExchange, ssrExchange, fetchExchange],
})
