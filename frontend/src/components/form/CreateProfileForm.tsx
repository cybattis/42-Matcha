import {
  Button,
  HStack,
  Input,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { UseFormReturn } from "react-hook-form";
import { FormEventHandler } from "react";
import { UserProfileFormValue } from "@/routes/app/profile-creation.tsx";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { useCoordinate } from "@/lib/useCoordinate.ts";

export function CreateProfileForm(props: {
  form: UseFormReturn<UserProfileFormValue>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const { form } = props;
  const errors = form.formState.errors;
  const coordinates = useCoordinate();

  return (
    <form onSubmit={props.onSubmit}>
      <VStack gap="4" align="center">
        <Stack gap="5" direction="column" w={"full"}>
          <HStack gap="4">
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
          </HStack>
          <Field
            label="Gender"
            invalid={!!errors.gender}
            errorText={errors.gender?.message}
          >
            <RadioGroup defaultValue="1">
              <HStack gap="6">
                <Radio value="1">Male</Radio>
                <Radio value="2">Female</Radio>
              </HStack>
            </RadioGroup>
          </Field>
          <Field
            label="Sexual orientation"
            invalid={!!errors.sexualOrientation}
            errorText={errors.sexualOrientation?.message}
          >
            <RadioGroup defaultValue="1">
              <HStack gap="6">
                <Radio value="1">Hetero</Radio>
                <Radio value="2">Homo</Radio>
                <Radio value="2">Bi</Radio>
              </HStack>
            </RadioGroup>
          </Field>
          <Field
            label="City"
            invalid={!!errors.coordinates}
            errorText={errors.coordinates?.message}
          >
            {coordinates.lat} {coordinates.lon}
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
