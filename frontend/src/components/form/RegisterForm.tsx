import {Button, Input, Stack, Text, VStack} from '@chakra-ui/react';
import {Field} from '@/components/ui/field';
import {PasswordInput} from '@/components/ui/password-input';
import {FormSubmitHandler, UseFormReturn} from 'react-hook-form';
import {RegisterFormValues} from "@/routes/auth/register.tsx";
import {Link} from "@tanstack/react-router";
import {RiArrowRightLine} from "react-icons/ri";

export function RegisterForm(props: {
  form: UseFormReturn<RegisterFormValues>,
  onSubmit: FormSubmitHandler<RegisterFormValues>
}) {
  const {form} = props;
  const errors = form.formState.errors;

  return (
    <form onSubmit={props.onSubmit}>
      <VStack gap="4" align="center">
        <Stack gap="10" direction="row" w={"full"}>
          <Field
            label="Username"
            invalid={!!errors.username}
            errorText={errors.username?.message}
          >
            <Input
              {...form.register('username', {required: 'Username is required'})}
            />
          </Field>
          <Field
            label="Birthdate"
            invalid={!!errors.birthdate}
            errorText={errors.birthdate?.message}
          >
            <Input
              type="date" placeholder="YYYY-MM-DD"
              {...form.register('birthdate', {required: 'Birthdate is required'})}
            />
          </Field>
        </Stack>
        <Stack gap="10" direction="row">
          <Field
            label="Password"
            invalid={!!errors.password}
            errorText={errors.password?.message}
          >
            <PasswordInput
              variant="subtle"
              {...form.register('password', {required: 'Password is required'})}
            />
          </Field>
          <Field
            label="Password"
            invalid={!!errors.password}
            errorText={errors.password?.message}
          >
            <PasswordInput
              {...form.register('password', {required: 'Password is required'})}
            />
          </Field>
        </Stack>
        <Field
          label="Email"
          invalid={!!errors.email}
          errorText={errors.email?.message} required
        >
          <Input placeholder="me@example.com" variant="subtle"/>
        </Field>
        <Field
          label="Email"
          invalid={!!errors.email}
          errorText={errors.email?.message}
          required
        >
          <Input
            placeholder="me@example.com" variant="outline"
            {...form.register('email', {required: 'Email is required'})}
          />
        </Field>
        <Button type="submit" size="md" cursor="pointer">
          Submit
        </Button>
        <Stack direction="row" spacing={4} align="center">
          <Text justify={'center'}>Already have an account ? </Text>
          <Link to={'/auth/login'} className={'chakra-button'}>
            <Button size='xs' variant="subtle">
              Login <RiArrowRightLine/>
            </Button>
          </Link>
        </Stack>
      </VStack>
    </form>
  );
}
