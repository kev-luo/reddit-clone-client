import React from "react";
import { Formik, Form } from "formik";
import { Button } from "@chakra-ui/react";
import { useMutation } from "urql";

import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
interface registerProps {

}

const FETCH_USER = `
  mutation Register($username: String!, $password: String!) {
    register(options:{username:$username, password:$password}) {
      user{
        id
        username
      }
      errors{
        field
        message
      }
    }
  }
`

const Register: React.FC<registerProps> = ({ }) => {
  const [, register] = useMutation(FETCH_USER)
  const initialValues = { username: "", password: "" };

  const handleSubmit = (values: { username: string; password: string; }) => {
    return register(values)
  }

  return (
    <Wrapper variant="small">
      <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
        {(props) => (
          <Form>
            <InputField name="username" label="Username" />
            <InputField name="password" label="Password" type="password" />
            <Button type="submit" isLoading={props.isSubmitting}>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default Register