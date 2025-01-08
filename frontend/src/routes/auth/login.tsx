import {createFileRoute} from '@tanstack/react-router';
import {VStack} from '@chakra-ui/react';
import {LoginForm} from '@/components/LoginForm.tsx';
import {useForm} from "react-hook-form";

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
});

export interface LoginFormValues {
  username: string;
  password: string;
}

async function TryLogin(data: LoginFormValues) {
  const response = await fetch('http://localhost:5163/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function RouteComponent() {
  const form = useForm<LoginFormValues>();

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
    TryLogin(data).then((res) => {
      console.log(res);
      localStorage.setItem('token', res.token);
      window.location.href = '/app/home';
    });
  });

  return (
    <VStack gap={6} align={'center'}>
      <LoginForm form={form} onSubmit={onSubmit}/>
    </VStack>
  );
}
