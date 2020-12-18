import React from "react";
import { Formik, Form } from "formik";
import { Button } from "@chakra-ui/react";

import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
  const initialValues = { username: "", password: "" };

  const handleSubmit = (values: { username: string; password: string; }) => {
    console.log(values);
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