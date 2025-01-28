import {
  Button,
  Flex,
  HStack,
  Input,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { UseFormReturn } from "react-hook-form";
import { FormEventHandler } from "react";
import { Tags, UserProfileFormValue } from "@/routes/app/profile/creation.tsx";
import { useCoordinate } from "@/lib/useCoordinate.ts";
import { Radio, RadioGroup } from "@/components/ui/radio.tsx";
import { TagButton } from "@/components/TagButton.tsx";

export function CreateProfileForm(props: {
  form: UseFormReturn<UserProfileFormValue>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  tags: Tags[];
}) {
  const { form, tags, onSubmit } = props;
  const errors = form.formState.errors;
  const coordinates = useCoordinate();

  return (
    <form onSubmit={onSubmit}>
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
          <div>Tags</div>
          <Flex wrap="wrap" gap={2} justifyContent="flex-start" maxW="xl">
            {tags
              ? tags.map((tag: Tags) => <TagButton name={tag.name} />)
              : null}
          </Flex>
        </Stack>
        <Button type="submit" size="md" cursor="pointer">
          Save
        </Button>
      </VStack>
    </form>
  );
}
