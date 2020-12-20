import React from "react";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../../utils/urqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";

const Post = ({ }) => {
  const router = useRouter();
  const intId = typeof router.query.id === "string" ? parseInt(router.query.id) : -1
  const [{data}] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId
    }
  });
  console.log(data)
  return (
    <Layout>
    </Layout>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Post);