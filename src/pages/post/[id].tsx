import React from "react";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../../utils/urqlClient";
import { Layout } from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/react";
import { useQueryParams } from "../../utils/useQueryParams";
import { usePostQuery } from "../../generated/graphql";

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
      <Heading>
        {data.post.title}
      </Heading>
      <Box>
        {data.post.text}
      </Box>
    </Layout>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Post);