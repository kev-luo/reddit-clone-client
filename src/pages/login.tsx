import React from "react";
import { Formik, Form, FormikErrors } from "formik";
import { Button, Flex, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";

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
  const initialValues = { usernameOrEmail: "", password: "" };

  const handleSubmit = async (values: { usernameOrEmail: string; password: string; }, setErrors: { (errors: FormikErrors<{ usernameOrEmail: string; password: string; }>): void; (arg0: Record<string, string>): void; }) => {
    const response = await login(values);
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
              <InputField name="usernameOrEmail" label="Username/Email" />
              <InputField name="password" label="Password" type="password" />
              <Flex my={2}>
                <NextLink href="/forgot-password">
                  <Link ml="auto">Forget Password?</Link>
                </NextLink>
              </Flex>
              <Button type="submit" isLoading={props.isSubmitting}>Login</Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
}

export default withUrqlClient(urqlClient)(Login)