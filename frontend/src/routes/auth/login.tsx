import {createFileRoute, Navigate, redirect} from '@tanstack/react-router';
import {VStack} from '@chakra-ui/react';
import {useForm} from "react-hook-form";
import {useAuth} from "@/auth.tsx";
import {MyRooterContext} from "@/routes/__root.tsx";
import {LoginForm} from "@/components/form/LoginForm.tsx";
import {toaster} from "@/components/ui/toaster.tsx";
import {ToasterError, ToasterSuccess} from "@/lib/toaster.ts";

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
  beforeLoad: ({context}: { context: MyRooterContext }) => {
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
    ToasterError('Erreur', 'Une erreur est survenue');
  }
}

function RouteComponent() {
  const auth = useAuth();
  const form = useForm<LoginFormValues>();

  const onSubmit = form.handleSubmit(async (data) => {
    const t = toaster.loading({title: 'Connexion en cours...'});
    const result = await TryLogin(data);
    if (result.error) {
      ToasterError('Erreur', result.message);
    }
    if (result.token) {
      await auth.login(result.token);
      ToasterSuccess('Vous êtes connecté !');
    }
    toaster.remove(t);
  });

  return (
    <VStack gap={6} align={'center'}>
      <LoginForm form={form} onSubmit={onSubmit}/>
      {auth.isAuthenticated && <Navigate to={'/app/home'}/>}
    </VStack>
  );
}
