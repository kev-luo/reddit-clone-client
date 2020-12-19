import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPwMutation } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient";

const ForgotPassword: React.FC<{}> = ({ }) => {
  const router = useRouter();
  const [complete, setComplete] = useState(false);
  const initialValues = { email: "" }
  const [, forgotPw] = useForgotPwMutation();

  return (
    <Wrapper variant="small">
      <Formik initialValues={initialValues} onSubmit={async (values) => {
        await forgotPw(values);
        setComplete(true);
        router.push("/");
        return;
      }}>
        {(props) => complete ? (
          <Box>If an acount with that email exists, you will receive a message with the reset password link.</Box>
        ) : (
            <Form>
              <InputField name="email" label="Email" type="email" />
              <Button type="submit" isLoading={props.isSubmitting}>Send Reset Link</Button>
            </Form>
          )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(urqlClient)(ForgotPassword);