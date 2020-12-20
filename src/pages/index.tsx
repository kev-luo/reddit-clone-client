import React, { useState } from "react";
import { withUrqlClient } from "next-urql"
import { Link, Stack, Box, Heading, Text, Flex, Button, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import { BsTrash2 } from "react-icons/bs";

import { Layout } from "../components/Layout";
import { useDeletePostMutation, usePostsQuery } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient"
import { UpvoteSection } from "../components/UpvoteSection";

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string })
  const [{ data, fetching, stale }] = usePostsQuery({ variables });
  const [, deletePost] = useDeletePostMutation();

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
                  <IconButton
                    aria-label="delete post"
                    icon={<BsTrash2 />}
                    size="xs"
                    alignSelf="center"
                    onClick={() => deletePost({ id: post.id })}
                  />
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
