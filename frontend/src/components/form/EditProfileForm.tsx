import {
  Button,
  CheckboxGroup,
  Field,
  Fieldset,
  Flex,
  HStack,
  Input,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  Control,
  Controller,
  FormState,
  useController,
  UseFormRegister,
} from "react-hook-form";
import { FormEventHandler } from "react";
import {
  Tags,
  UserProfileFormValue,
} from "@/routes/app/profile/edit-profile.tsx";
import { useCoordinate } from "@/lib/useCoordinate.ts";
import { Radio, RadioGroup } from "@/components/ui/radio.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";

export function EditProfileForm(props: {
  formState: FormState<UserProfileFormValue>;
  register: UseFormRegister<UserProfileFormValue>;
  control: Control<UserProfileFormValue>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  tagsData: Tags[];
}) {
  const { formState, tagsData, onSubmit, register, control } = props;
  const errors = formState.errors;
  const coordinates = useCoordinate();

  const tags = useController({
    control,
    name: "tags",
    defaultValue: [],
  });

  const invalidTags = !!errors.tags;

  return (
    <form onSubmit={onSubmit}>
      <VStack gap="4" align="center">
        <Fieldset.Root>
          <Stack gap="5" direction="column" w={"full"}>
            <Fieldset.Content>
              <HStack gap="4">
                <Field.Root required invalid={!!errors.firstName}>
                  <Field.Label>
                    First name
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input {...register("firstName")} />
                  <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root required invalid={!!errors.lastName}>
                  <Field.Label>
                    Last name
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input {...register("lastName")} />
                  <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
                </Field.Root>
              </HStack>
              <Controller
                name="gender"
                defaultValue={1}
                control={control}
                render={() => (
                  <RadioGroup defaultValue="1">
                    <HStack gap="6">
                      <Radio value="1">Male</Radio>
                      <Radio value="2">Female</Radio>
                    </HStack>
                  </RadioGroup>
                )}
              />
              <Controller
                name="sexualOrientation"
                control={control}
                defaultValue={1}
                render={() => (
                  <RadioGroup defaultValue="1">
                    <HStack gap="6">
                      <Radio value="1">Hetero</Radio>
                      <Radio value="2">Homo</Radio>
                      <Radio value="3">Bi</Radio>
                    </HStack>
                  </RadioGroup>
                )}
              />
              <Field.Root required invalid={!!errors.coordinates}>
                <Field.Label>
                  City
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  {...register("coordinates")}
                  value={
                    coordinates.lat?.toString() +
                    " " +
                    coordinates.lon?.toString()
                  }
                />
                <Field.ErrorText>{errors.coordinates?.message}</Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!errors.biography}>
                <Field.Label>Profile bio</Field.Label>
                <Textarea placeholder="I am ..." {...register("biography")} />
                <Field.ErrorText>{errors.biography?.message}</Field.ErrorText>
              </Field.Root>
            </Fieldset.Content>
            <Fieldset.Legend>Tags</Fieldset.Legend>
            <CheckboxGroup
              invalid={invalidTags}
              value={tags.field.value.map((v) => v.toString())}
              onValueChange={tags.field.onChange}
              name={tags.field.name}
            >
              <Fieldset.Content>
                <Flex
                  wrap="wrap"
                  maxW={"2xl"}
                  gap={2}
                  justifyContent={"flex-start"}
                >
                  {tagsData.length > 0
                    ? tagsData.map((tag: Tags) => (
                        <Checkbox
                          key={tag.id}
                          value={tag.id.toString()}
                          minW={"100px"}
                        >
                          {tag.name}
                        </Checkbox>
                      ))
                    : null}
                </Flex>
              </Fieldset.Content>
            </CheckboxGroup>
            {errors.tags && (
              <Fieldset.ErrorText>{errors.tags.message}</Fieldset.ErrorText>
            )}
          </Stack>
          <Button type="submit" size="md" cursor="pointer">
            Save
          </Button>
        </Fieldset.Root>
      </VStack>
    </form>
  );
}
