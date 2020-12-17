import { FormErrorMessage, FormLabel, Input, FormControl } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
  const initialValues = { username: "", password: "" };

  const handleSubmit = (values: { username: string; password: string; }) => {
    console.log(values)
  }

  return (
    <Wrapper variant="small">
      <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
        {({ values, handleChange }) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input value={values.username} id="username" placeholder="user..." onChange={handleChange} />
              {/* <FormErrorMessage>Error</FormErrorMessage> */}
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default Register