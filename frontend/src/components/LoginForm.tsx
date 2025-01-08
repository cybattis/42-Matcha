import {Button, Input, Stack, VStack} from '@chakra-ui/react';
import {Field} from '@/components/ui/field';
import {PasswordInput} from '@/components/ui/password-input';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from '@tanstack/react-router';
import {Text} from '@chakra-ui/react';

interface FormValues {
  username: string;
  password: string;
}

async function TryLogin(data: FormValues) {
  const reponse = await fetch('http://localhost:5163/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return reponse.json();
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
    TryLogin(data).then((res) => {
      console.log(res);
      localStorage.setItem('token', res.token);
      window.location.href = '/app/home';
    });
  });

  return (
    <form onSubmit={onSubmit}>
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
    </form>
  );
}
