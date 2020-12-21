import { Button, useQuery } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation, usePostQuery } from "../../../generated/graphql";
import { urqlClient } from "../../../utils/urqlClient";
import { useAuth } from "../../../utils/useAuth";
import { useQueryParams } from "../../../utils/useQueryParams";

const EditPost = ({ }) => {
  const router = useRouter();
  const intId = useQueryParams();
  useAuth()
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId
    }
  })
  const [, updatePost] = useUpdatePostMutation();

  if (fetching) return <Layout>Loading...</Layout>
  if (!data?.post) return <Layout>Could not find posts.</Layout>

  const initialValues = { title: data.post?.title, text: data.post?.text }

  return (
    <Layout>
      <Formik initialValues={initialValues} onSubmit={async (values) => {
        await updatePost({
          id: intId,
          ...values
        })
        router.back();
      }}>
        {(props) => (
          <Form>
            <InputField name="title" label="Title" />
            <InputField name="text" label="Body" textarea />
            <Button type="submit" isLoading={props.isSubmitting}>Submit</Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(urqlClient)(EditPost);