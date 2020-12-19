import React from "react";
import { Formik, Form, FormikErrors } from "formik";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";

import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { toErrorMap } from "../utils/toErrorMap";
import { useLoginMutation } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient";

interface loginProps {

}

const Login: React.FC<loginProps> = ({ }) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  const initialValues = { username: "", password: "" };

  const handleSubmit = async (values: { username: string; password: string; }, setErrors: { (errors: FormikErrors<{ username: string; password: string; }>): void; (arg0: Record<string, string>): void; }) => {
    const response = await login({ options: values });
    if (response.data?.login.errors) {
      setErrors(toErrorMap(response.data.login.errors));
    } else if (response.data?.login.user) {
      router.push("/");
    }
  }

  return (
    <>
      <Wrapper variant="small">
        <Formik initialValues={initialValues} onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}>
          {(props) => (
            <Form>
              <InputField name="username" label="Username" />
              <InputField name="password" label="Password" type="password" />
              <Button type="submit" isLoading={props.isSubmitting}>Login</Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
}

export default withUrqlClient(urqlClient)(Login)