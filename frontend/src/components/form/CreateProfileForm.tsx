import { Button, Input, Stack, Textarea, VStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { UseFormReturn } from "react-hook-form";
import { FormEventHandler } from "react";
import { UserProfileFormValue } from "@/routes/app/profile-creation.tsx";

export function CreateProfileForm(props: {
  form: UseFormReturn<UserProfileFormValue>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const { form } = props;
  const errors = form.formState.errors;

  return (
    <form onSubmit={props.onSubmit}>
      <VStack gap="4" align="center">
        <Stack gap="10" direction="row" w={"full"}>
          <Field
            label="First name"
            invalid={!!errors.firstName}
            errorText={errors.firstName?.message}
          >
            <Input
              {...form.register("firstName", {
                required: "First name is required",
              })}
            />
          </Field>
          <Field
            label="Last name"
            invalid={!!errors.lastName}
            errorText={errors.lastName?.message}
          >
            <Input
              {...form.register("lastName", {
                required: "Last name is required",
              })}
            />
          </Field>
          <Field
            label="Profile bio"
            invalid={!!errors.biography}
            helperText="A short description of yourself"
            errorText={errors.biography?.message}
          >
            <Textarea placeholder="I am ..." {...form.register("biography")} />
          </Field>
        </Stack>
        <Button type="submit" size="md" cursor="pointer">
          Save
        </Button>
      </VStack>
    </form>
  );
}
