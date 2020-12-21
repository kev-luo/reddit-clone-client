import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { urqlClient } from "../../../utils/urqlClient";
import { useAuth } from "../../../utils/useAuth";
import { useQueryParams } from "../../../utils/useQueryParams";

const EditPost = ({ }) => {
  useAuth()
  const [{ data }] = useQueryParams();

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