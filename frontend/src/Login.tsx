import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  FormHelperText,
  Card
} from "@chakra-ui/react";
import useAppStore from './appStore'

export default function Login() {

  type FormValues = {
    username: string;
    password: string;
  }

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<FormValues>()

  const signIn = useAppStore((state) => state.signIn);
  const setAuthUI = useAppStore((state) => state.setAuthUI);

  const onSubmit = async (values: FormValues) => {
    const resp = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    })
    if (resp.status === 200) {
      signIn(values.username);
    } else {
      setError('password', { type: 'custom', message: 'Could not find associated user' });
    }
  }

  return (
    <Card>
      <Flex align="center" justify="center">
        <Box p={6} rounded="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="flex-start">
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id='username'
                  placeholder='username'
                  {...register('username', {
                    required: 'This is required',
                    minLength: { value: 1, message: 'Should not be empty' },
                  })}
                />
                <FormErrorMessage>
                  {errors.username && <p role="alert">{errors.username?.message?.toString()}</p>}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password && touchedFields.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id='password'
                  placeholder='password'
                  type='password'
                  {...register('password', {
                    required: 'This is required',
                    minLength: { value: 4, message: 'Minimum length should be 4' },
                  })}
                />
                <FormErrorMessage>{errors.password && <p role="alert">{errors.password?.message?.toString()}</p>}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <Button type="submit" colorScheme="blue" width="full" disabled={isSubmitting}>
                  Login
                </Button>
              </FormControl>
              <FormControl>
                <FormHelperText>
                  {"Don't have an account? "}
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => setAuthUI('register')}
                  >
                    Register
                  </Button>
                </FormHelperText>
              </FormControl>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Card>
  );
}
