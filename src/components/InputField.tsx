import { FormErrorMessage, FormLabel, Input, FormControl, Textarea } from "@chakra-ui/react";
import { useField } from "formik";
import { InputHTMLAttributes } from "react";

// this is saying we want this component to take in any props that a regular input field would take
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; textarea?: boolean};

// size: _ strips size out of props and renames it to _

export const InputField: React.FC<InputFieldProps> = ({label, textarea, size: _, ...props}) => {
  let InputOrTextarea;
  if(textarea) {
    InputOrTextarea = Textarea;
  } else {
    InputOrTextarea = Input;
  }

  const [field, {error}] = useField(props);
  
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea {...field} {...props} id={field.name} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}