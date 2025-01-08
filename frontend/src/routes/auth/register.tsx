import {createFileRoute} from '@tanstack/react-router';
import {useForm} from "react-hook-form";
import {RegisterForm} from "@/components/RegisterForm.tsx";
import {VStack} from "@chakra-ui/react";

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
  const response = await fetch('http://localhost:5163/auth/CreateNewAccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function RouteComponent() {
  const form = useForm<RegisterFormValues>();

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
    TryRegister(data).then((res) => {
      console.log(res);
      // window.location.href = '/auth/check-email';
    }).catch((err) => {
      console.error(err);
    });
  });

  return (
    <VStack gap={6} align={'center'}>
      <RegisterForm onSubmit={onSubmit} form={form}/>
    </VStack>
  )
}
