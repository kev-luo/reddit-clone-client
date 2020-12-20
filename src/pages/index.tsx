import { withUrqlClient } from "next-urql"
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient"
import { Link, Stack, Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10
    }
  });

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
            {data!.posts.map(post => (
              <Box key={post.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{post.title}</Heading>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
            ))}
          </Stack>
        )}
      {data && (
        <Flex justifyContent="center">
          <Button isLoading={fetching} my={8}>Load More</Button>
        </Flex>
      )}
    </Layout>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Index)