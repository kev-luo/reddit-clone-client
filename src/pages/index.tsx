import React, { useState } from "react";
import { withUrqlClient } from "next-urql"
import { Link, Stack, Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";

import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient"
import { UpvoteSection } from "../components/UpvoteSection";

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string})
  const [{ data, fetching, stale }] = usePostsQuery({variables});

  if(!fetching && !data) {
    return <div>Posts query wasn't able to retrieve the posts.</div>
  }

  return (
    <Layout>
      <Flex justifyContent="space-between" alignItems="flex-end">
        <Heading>Reddit Clone</Heading>
        <NextLink href="/create-post">
          <Link>Create Post</Link>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? <div>Loading...</div> :
        (
          <Stack>
            {data!.posts.posts.map(post => (
              <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                <UpvoteSection points={post.points} />
                <Box>
                  <Heading fontSize="xl">{post.title}</Heading>
                  <Text>OP: {post.author.username}</Text>
                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
              </Flex>
            ))}
          </Stack>
        )}
      {data && data.posts.hasMore && (
        <Flex justifyContent="center">
          <Button isLoading={stale} my={8} onClick={() => {
            setVariables({
              ...variables,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
            })
          }}>Load More</Button>
        </Flex>
      )}
    </Layout>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Index)
