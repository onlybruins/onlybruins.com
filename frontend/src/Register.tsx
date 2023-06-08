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
  Card,
  useToast
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
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<FormValues>()

  const signIn = useAppStore((state) => state.signIn);
  const toast = useToast();

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
      toast({ status: 'error', position: 'bottom', title: 'User already exists' });
    }
  }

  return (
    <Card>
      <Flex align="center" justify="center">
        <Box p={6} rounded="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="flex-start">
              <FormControl isInvalid={!!errors.username}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id='username'
                  placeholder='bobbymcbobberface'
                  {...register('username', {
                    required: 'This is required',
                    pattern: {
                      value: /^[A-Za-z0-9][-_ A-Za-z0-9]*[A-Za-z0-9]$/,
                      message: "Must match ^[A-Za-z0-9][-_ A-Za-z0-9]*[A-Za-z0-9]$",
                    }
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
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id='email'
                  placeholder='bobby@gmail.com'
                  {...register('email', {
                    required: 'This is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email && <p role="alert">{errors.email?.message?.toString()}</p>}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id='password'
                  placeholder='password'
                  type='password'
                  {...register('password', {
                    required: 'This is required',
                    minLength: { value: 4, message: 'Minimum length is 4' },
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
