import { withUrqlClient } from "next-urql"
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient"
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      <br />
      {!data ? <div>Loading...</div> : data.posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </Layout>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Index)