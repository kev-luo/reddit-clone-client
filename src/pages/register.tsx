import { Formik, Form } from "formik";
interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
  const initialValues = {username:"", password:""};

  const handleSubmit = (values: { username: string; password: string; }) => {
    console.log(values)
  }
  
  return (
    <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
      {() => (
        <Form>
          <div>Hello</div>
        </Form>
      )}
    </Formik>
  );
}

export default Register