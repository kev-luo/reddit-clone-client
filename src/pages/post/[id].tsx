import { Box, Flex, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { EditDeletePostBtns } from "../../components/EditDeletePostBtns";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { urqlClient } from "../../utils/urqlClient";
import { useQueryParams } from "../../utils/useQueryParams";

const Post = ({ }) => {
  const [{ data, fetching, error }] = usePostQuery({
    pause: useQueryParams() === -1,
    variables: {
      id: useQueryParams()
    }
  });

  if (fetching) return <Layout>Loading...</Layout>
  if (error) return <Layout>{error.message}</Layout>
  if (!data?.post) return <Layout>Could not find posts.</Layout>

  return (
    <Layout>
      <Flex justifyContent="space-between">
        <Heading>
          {data.post.title}
        </Heading>
        <EditDeletePostBtns id={data.post.id} authorId={data.post.author.id} />
      </Flex>
      <Box>
        {data.post.text}
      </Box>
    </Layout>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Post);