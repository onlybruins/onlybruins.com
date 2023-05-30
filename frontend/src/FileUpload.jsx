/* Adapted from https://github.com/chakra-ui/chakra-ui/issues/457 */

import { Input, Image, FormControl, FormLabel, InputGroup, InputLeftElement, FormErrorMessage, Icon } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Image as ImageIcon } from "phosphor-react";
import { useController } from "react-hook-form";
import { useRef } from "react";

export const FileUpload = ({ name, placeholder, acceptedFileTypes, control, children, isRequired = false }) => {
  const inputRef = useRef();
  const {
    field: { ref, onChange, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  return (
    <CardBody>
      <FormControl isInvalid={invalid} isRequired>
        <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
        {
          value && (
            <Image borderRadius="8px" width="100%" src={URL.createObjectURL(value)} mb='10px' />
          )
        }
        <InputGroup>
          <InputLeftElement
            pointerEvents="none">
            <ImageIcon weight="fill" size={24} />
          </InputLeftElement>
          <input type='file'
            onChange={(e) => onChange(e.target.files[0])}
            accept={acceptedFileTypes}
            name={name}
            ref={inputRef}
            {...inputProps}
            style={{ display: 'none' }} />
          <Input
            placeholder={placeholder || "Your file ..."}
            onClick={() => inputRef.current.click()}
            // onChange={(e) => {}}
            readOnly={true}
            value={value && value.name || ''}
          />
        </InputGroup>
        <FormErrorMessage>
          {invalid}
        </FormErrorMessage>
      </FormControl>
    </CardBody>
  );
}

FileUpload.defaultProps = {
  acceptedFileTypes: '',
  allowMultipleFiles: false,
};

export default FileUpload;
