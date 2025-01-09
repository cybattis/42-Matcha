import {Button, Input, Stack, VStack} from '@chakra-ui/react';
import {Field} from '@/components/ui/field';
import {PasswordInput} from '@/components/ui/password-input';
import {FormSubmitHandler, useForm, UseFormReturn} from 'react-hook-form';
import {Link, useNavigate} from '@tanstack/react-router';
import {Text} from '@chakra-ui/react';
import {LoginFormValues} from "@/routes/auth/login.tsx";
import {RiArrowRightLine} from "react-icons/ri";

export function LoginForm(props: {
  form: UseFormReturn<LoginFormValues>,
  onSubmit: FormSubmitHandler<LoginFormValues>
}) {
  const {form} = props;
  const errors = form.formState.errors;

  return (
    <form onSubmit={props.onSubmit}>
      <VStack gap="4" align="center" maxW="sm">
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
          label="Password"
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <PasswordInput
            {...form.register('password', {required: 'Password is required'})}
          />
        </Field>
        <Button type="submit" size="md" cursor="pointer">
          Submit
        </Button>
        <Stack direction="row" spacing={4} align="center">
          <Text>Does not have account ? </Text>
          <Link to={'/auth/register'} className={'chakra-button'}>
            <Button size='xs' variant="subtle">
              Register <RiArrowRightLine/>
            </Button>
          </Link>
        </Stack>
      </VStack>
    </form>
  );
}
