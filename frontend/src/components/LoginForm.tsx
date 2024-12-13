"use client"

import {Button, Input, VStack} from "@chakra-ui/react"
import {Field} from "@/components/ui/field"
import {PasswordInput} from "@/components/ui/password-input"
import {useForm} from "react-hook-form"
import {Link} from "@tanstack/react-router";

interface FormValues {
  username: string
  password: string
}

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>()

  const onSubmit = handleSubmit((data) => console.log(data))

  return (
    <form onSubmit={onSubmit}>
      <VStack gap="4" align="center" maxW="sm">
        <Field
          label="Username"
          invalid={!!errors.username}
          errorText={errors.username?.message}
        >
          <Input
            {...register("username", {required: "Username is required"})}
          />
        </Field>

        <Field
          label="Password"
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <PasswordInput
            {...register("password", {required: "Password is required"})}
          />
        </Field>
        <Link to={"/register"}>Does not have account ? Register</Link>
        <Button type="submit" size="md">Submit</Button>
      </VStack>
    </form>
  )
}
