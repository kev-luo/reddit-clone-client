import React from "react";
import { Formik, Form, FormikErrors } from "formik";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";

import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { urqlClient } from "../utils/urqlClient";
interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
  const router = useRouter();
  const [, register] = useRegisterMutation()
  const initialValues = { username: "", email: "", password: "" };

  const handleSubmit = async (values: { username: string; email: string, password: string; }, setErrors: { (errors: FormikErrors<{ username: string; email: string, password: string; }>): void; (arg0: Record<string, string>): void; }) => {
    const response = await register({options: values})
    if(response.data?.register.errors) {
      setErrors(toErrorMap(response.data.register.errors))
    } else if(response.data?.register.user) {
      router.push("/");
    }
  }

  return (
    <Wrapper variant="small">
      <Formik initialValues={initialValues} onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}>
        {(props) => (
          <Form>
            <InputField name="username" label="Username" />
            <InputField name="email" label="Email" />
            <InputField name="password" label="Password" type="password" />
            <Button type="submit" isLoading={props.isSubmitting}>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(urqlClient)(Register)