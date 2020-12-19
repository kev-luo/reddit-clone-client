import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../utils/urqlClient";
import { Layout } from "../components/Layout";


const CreatePost: React.FC<{}> = ({ }) => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  
  useEffect(() => {
    if(!fetching && !data?.me) {
      router.replace("/login");
    }
  }, [fetching, data, router])

  const [, createPost] = useCreatePostMutation();
  const initialValues = {title: "", text: ""}
  return (
    <Layout variant="small">
      <Formik initialValues={initialValues} onSubmit={async (values) => {
        const { error } = await createPost({ input: values })
        if(!error) {
          router.push("/");
        }
      }}>
        {(props) => (
          <Form>
            <InputField name="title" label="Title" />
            <InputField name="text" label="Body" textarea/>
            <Button type="submit" isLoading={props.isSubmitting}>Submit</Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(urqlClient)(CreatePost)