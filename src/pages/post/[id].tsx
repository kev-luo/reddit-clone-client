import React from "react";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../../utils/urqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/react";

const Post = ({ }) => {
  const router = useRouter();
  const intId = typeof router.query.id === "string" ? parseInt(router.query.id) : -1
  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId
    }
  });

  if (fetching) {
    return <Layout>Loading...</Layout>
  }

  if (error) {
    return <Layout>{error.message}</Layout>
  }

  if (!data?.post) {
    return <Layout>Could not find posts.</Layout>
  }

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