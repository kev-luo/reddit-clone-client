import React from "react";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../../utils/urqlClient";
import { Layout } from "../../components/Layout";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useQueryParams } from "../../utils/useQueryParams";
import { useMeQuery, usePostQuery } from "../../generated/graphql";
import { EditDeletePostBtns } from "../../components/EditDeletePostBtns";

const Post = ({ }) => {
  const [{ data: meData }] = useMeQuery();
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
        {meData?.me?.id === data.post.author.id && <EditDeletePostBtns id={data.post.id} />}
      </Flex>
      <Box>
        {data.post.text}
      </Box>
    </Layout>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Post);