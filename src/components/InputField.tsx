import { FormErrorMessage, FormLabel, Input, FormControl } from "@chakra-ui/react";
import { useField } from "formik";
import { InputHTMLAttributes } from "react";

// this is saying we want this component to take in any props that a regular input field would take
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; placeholder: string; };

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, {error}] = useField(props);
  console.log('field: ', field);
  console.log('props: ', props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input {...field} id={field.name} placeholder={props.placeholder} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}