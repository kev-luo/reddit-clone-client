import React from "react";
import { Formik, Form, FormikErrors } from "formik";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { toErrorMap } from "../utils/toErrorMap";

interface loginProps {

}

const Login: React.FC<loginProps> = ({ }) => {
  const router = useRouter();
  const initialValues = { username: "", password: "" };

  const handleSubmit = async (values: { username: string; password: string; }) => {
    console.log(values);
    router.push("/login");
  }

  return (
    <Wrapper variant="small">
      <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
        {(props) => (
          <Form>
            <InputField name="username" label="Username"/>
            <InputField name="password" label="Password" type="password" />
            <Button type="submit" isLoading={props.isSubmitting}>Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default Login