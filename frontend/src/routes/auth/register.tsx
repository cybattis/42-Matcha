import {createFileRoute, Navigate} from '@tanstack/react-router';
import {useForm} from "react-hook-form";
import {VStack} from "@chakra-ui/react";
import {RegisterForm} from "@/components/form/RegisterForm.tsx";
import {useState} from "react";

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
});

export interface RegisterFormValues {
  username: string;
  password: string;
  email: string;
  birthdate: string;
}

async function TryRegister(data: RegisterFormValues) {
  try {
    const response = await fetch('http://localhost:5163/auth/CreateNewAccount', {
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
  const form = useForm<RegisterFormValues>();
  const [isPending, setIsPending] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const onSubmit = form.handleSubmit(async (data) => {
    setIsPending(true);
    TryRegister(data).then((res) => {
      console.log(res);
      setIsRegistered(true);
    }).catch((err) => {
      console.error(err);
    });
    setIsPending(false);
  });

  if (isPending) {
    return <Text>Registering...</Text>
  }

  return (
    <VStack gap={6} align={'center'}>
      <RegisterForm onSubmit={onSubmit} form={form}/>
      {isRegistered && <Navigate to={'/auth/verify'}/>}
    </VStack>
  )
}
