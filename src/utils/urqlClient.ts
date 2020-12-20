import { dedupExchange, fetchExchange, Exchange, stringifyVariables } from "urql"
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import { LoginMutation, MeQuery, MeDocument, LogoutMutation, RegisterMutation, VoteMutationVariables } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";
import { gql } from "@urql/core";

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


    // uneeded for now
    // const visited = new Set();
    // let result: NullArray<string> = [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[cursorArgument];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== 'number'
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === 'after')
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
  };
};

export const urqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql", fetchOptions: { credentials: "include" as const }, exchanges: [dedupExchange, cacheExchange({
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
        },
        createPost: (_result, args, cache, info) => {
          const allFields = cache.inspectFields("Query");
          const fieldInfos = allFields.filter(info => info.fieldName === "posts");
          fieldInfos.forEach((fieldInfo) => {
            // invalidate cache and refetch posts
            cache.invalidate("Query", "posts", fieldInfo.arguments || {})
          })
        },
        vote: (_result, args, cache, info) => {
          // get type information
          const { postId, value } = args as VoteMutationVariables
          // posts with correct postId will be updated wherever they're displayed
          const data = cache.readFragment(gql`
            fragment _ on Post {
              id
              points
            }
          `, { id: postId })
          // if there is data from the cache
          if (data) {      
            const newPoints = (data.points as number) + (2*value);      
            cache.writeFragment(
              gql`
                fragment __ on Post {
                  points
                }
              `,
              { id: postId, points: newPoints }
            )
          }
        }
      }
    }
  }), errorExchange, ssrExchange, fetchExchange],
})