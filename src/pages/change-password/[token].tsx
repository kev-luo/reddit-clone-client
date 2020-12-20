import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePwMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { urqlClient } from "../../utils/urqlClient";

const ChangePassword: NextPage = () => {
  const [, changePw] = useChangePwMutation();
  const initialValues = { newPassword: "" }
  const router = useRouter();
  const [tokenError, setTokenError] = useState('');

  return (
    <Wrapper variant="small">
      <Formik initialValues={initialValues} onSubmit={async (values, { setErrors }) => {
        const response = await changePw({
          newPassword: values.newPassword,
          token: typeof router.query.token === "string" ? router.query.token : "",
        })
        if (response.data?.changePw.errors) {
          const errorMap = toErrorMap(response.data.changePw.errors)
          if ('token' in errorMap) {
            setTokenError(errorMap.token);
          }
          setErrors(errorMap);
        } else if (response.data?.changePw.user) {
          router.push("/");
        }
      }}>
        {(props) => (
          <Form>
            <InputField name="newPassword" label="New Password" type="password" />
            {tokenError && (
              <Box>
                <Box color="tomato">{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>Forgot Password</Link>
                </NextLink>
              </Box>
            )}
            <Button type="submit" isLoading={props.isSubmitting}>Change Password</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(urqlClient)(ChangePassword);