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

export default function Register() {
  const setAuthUI = useAppStore((state) => state.setAuthUI);

  type FormValues = {
    username: string;
    email: string;
    password: string;
    name: string;
  }

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<FormValues>()

  const signIn = useAppStore((state) => state.signIn);

  const onSubmit = async (values: FormValues) => {
    console.log('submitting')
    const resp = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    })
    console.log(`resp ${resp}`)
    if (resp.status === 200) {
      signIn(values.username);
    } else {
      setError('username', { type: 'custom', message: 'User already exists' });
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
                  placeholder='bobbymcbobberface'
                  {...register('username', {
                    required: 'This is required',
                    minLength: { value: 1, message: 'Should not be empty' },
                  })}
                />
                <FormErrorMessage>
                  {errors.username && <p role="alert">{errors.username?.message?.toString()}</p>}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <Input
                  id='name'
                  placeholder='Bob the Builder'
                  {...register('name')}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id='email'
                  placeholder='bobby@gmail.com'
                  {...register('email')}
                />
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
              <Button type="submit" colorScheme="blue" width="full" isLoading={isSubmitting}>
                Register
              </Button>
              <FormControl>
                <FormHelperText>
                  {"Already have an account? "}
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => setAuthUI('login')}
                  >
                    Login
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
