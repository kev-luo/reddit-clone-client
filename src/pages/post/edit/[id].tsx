import { Button } from "@chakra-ui/react";
import React from "react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { usePostQuery } from "../../../generated/graphql";
import { urqlClient } from "../../../utils/urqlClient";
import { useRouter } from "next/router";
import { useAuth } from "../../../utils/useAuth";

const EditPost = ({ }) => {
  const router = useRouter();
  useAuth()
  const intId = typeof router.query.id === "string" ? parseInt(router.query.id) : -1
  const [{ data }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId
    }
  })

  const initialValues = data ? (
    { title: data.post?.title, text: data.post?.text }
  ) : ({ title: "", text: "" })

  return (
    <Layout>
      {data && (
        <Formik initialValues={initialValues} onSubmit={() => console.log('hi')}>
          {(props) => (
            <Form>
              <InputField name="title" label="Title" />
              <InputField name="text" label="Body" textarea />
              <Button type="submit" isLoading={props.isSubmitting}>Submit</Button>
            </Form>
          )}
        </Formik>
      )}

    </Layout>
  );
}

export default withUrqlClient(urqlClient)(EditPost);