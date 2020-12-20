import { withUrqlClient } from "next-urql"
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient"
import { Link, Stack, Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10
    }
  });

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      <br />
      {!data ? <div>Loading...</div> :
        (
          <Stack>
            {data.posts.map(post => (
              <Box key={post.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{post.title}</Heading>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
            ))}
          </Stack>
        )}
    </Layout>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Index)