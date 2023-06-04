import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack
} from "@chakra-ui/react";

export default function Reg() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm()

  function onSubmit(values: any) {
    return new Promise((resolve: any) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
        resolve()
      }, 3000)
    })
  }

  return (
    <Flex align="center" justify="center">
      <Box p={6} rounded="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="flex-start">
            <FormControl>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id='email'
                placeholder='email'
                {...register('email', {
                  required: 'This is required',
                  minLength: { value: 4, message: 'Minimum length should be 4' },
                })}
              />
              <FormErrorMessage>
                {errors.email && <p role="alert">{errors.email?.message?.toString()}</p>}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password && touchedFields.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id='password'
                placeholder='password'
                {...register('password', {
                  required: 'This is required',
                  minLength: { value: 4, message: 'Minimum length should be 4' },
                })}
              />
              <FormErrorMessage>{errors.password && <p role="alert">{errors.password?.message?.toString()}</p>}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="purple" width="full">
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}
