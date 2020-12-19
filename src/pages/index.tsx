import { withUrqlClient } from "next-urql"
import { Navbar } from "../components/Navbar";
import { usePostsQuery } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient"

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <Navbar />
      <div>Hello World</div>
      <br />
      {!data ? <div>Loading...</div> : data.posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Index)