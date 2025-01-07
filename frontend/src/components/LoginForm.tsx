import {Button, Input, Stack, VStack} from '@chakra-ui/react';
import {Field} from '@/components/ui/field';
import {PasswordInput} from '@/components/ui/password-input';
import {Form, useForm} from 'react-hook-form';
import {Link, useNavigate} from '@tanstack/react-router';
import {Text} from '@chakra-ui/react';
import * as axios from "axios";

interface FormValues {
  username: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    // send to server
    axios.post('http://localhost:5163/Auth/Login', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: data.username, password: data.password}),
    }).then((response) => {
        localStorage.setItem('token', response.data.token);
        // navigate({
        //   to: '/app/home',
        // }).then();
      }
    );
  });

  return (
    <Form onSubmit={onSubmit}>
      <VStack gap="4" align="center" maxW="sm">
        <Field
          label="Username"
          invalid={!!errors.username}
          errorText={errors.username?.message}
        >
          <Input
            {...register('username', {required: 'Username is required'})}
          />
        </Field>
        <Field
          label="Password"
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <PasswordInput
            {...register('password', {required: 'Password is required'})}
          />
        </Field>
        <Stack direction="row" spacing={4}>
          <Text>Does not have account ? </Text>
          <Link to={'/auth/register'}>Register</Link>
        </Stack>
        <Button type="submit" size="md" cursor="pointer">
          Submit
        </Button>
      </VStack>
    </Form>
  );
}
