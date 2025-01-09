import {createFileRoute, Navigate, redirect} from '@tanstack/react-router';
import {Text, VStack} from '@chakra-ui/react';
import {useForm} from "react-hook-form";
import {useAuth} from "@/auth.tsx";
import {MyRooterContext} from "@/routes/__root.tsx";
import {LoginForm} from "@/components/form/LoginForm.tsx";
import {useEffect, useState} from "react";

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
  beforeLoad: ({context}: { context: MyRooterContext }) => {
    console.log(context.auth.isAuthenticated);
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/app/home',
      });
    }
  },
});

export interface LoginFormValues {
  username: string;
  password: string;
}

async function TryLogin(data: LoginFormValues) {
  try {
    const response = await fetch('http://localhost:5163/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (e) {
    console.error(e);
  }
}

function RouteComponent() {
  const auth = useAuth();
  const form = useForm<LoginFormValues>();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = form.handleSubmit(async (data) => {
    setIsPending(true);
    const result = await TryLogin(data);
    const isLogged = await auth.login(result.token);
    if (!isLogged)
      console.error('Login failed');
    setIsPending(false);
  });

  useEffect(() => {
  }, [isPending]);

  if (isPending) {
    return <Text>Logging in...</Text>
  }

  return (
    <VStack gap={6} align={'center'}>
      <LoginForm form={form} onSubmit={onSubmit}/>
      {auth.isAuthenticated && <Navigate to={'/app/home'}/>}
    </VStack>
  );
}
