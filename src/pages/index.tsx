import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { EditDeletePostBtns } from "../components/EditDeletePostBtns";
import { Layout } from "../components/Layout";
import { UpvoteSection } from "../components/UpvoteSection";
import { usePostsQuery } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient";


const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string })
  const [{ data, fetching, stale }] = usePostsQuery({ variables });

  if (!fetching && !data) {
    return <div>Posts query wasn't able to retrieve the posts.</div>
  }

  return (
    <Layout>
      <Flex justifyContent="space-between" alignItems="flex-end">
        <Heading>Feed</Heading>
        <NextLink href="/create-post">
          <Button as={Link}>Create Post</Button>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? <div>Loading...</div> :
        (
          <Stack>
            {data!.posts.posts.map(post => {
              return post ? (
                <Flex key={post.id} p={5} shadow="md" borderWidth="1px" justifyContent="space-between">
                  <Flex>
                    <UpvoteSection post={post} />
                    <Box>
                      <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                        <Link>
                          <Heading fontSize="xl">{post.title}</Heading>
                        </Link>
                      </NextLink>
                      <Text>OP: {post.author.username}</Text>
                      <Text mt={4}>{post.textSnippet}</Text>
                    </Box>
                  </Flex>
                  <EditDeletePostBtns id={post.id} authorId={post.author.id}/>
                </Flex>
              ) : null
            }
            )}
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
