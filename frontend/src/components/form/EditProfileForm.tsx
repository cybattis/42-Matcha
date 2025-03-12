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
  Controller,
  useController,
  UseFormReturn,
} from "react-hook-form";
import {FormEventHandler, useEffect, useState} from "react";
import {
  GetAddressFromCoordinates,
  GetAddressFromString,
  GetCoordinates,
  useCoordinate,
  UserCoordinates
} from "@/lib/useCoordinate.ts";
import {Radio, RadioGroup} from "@/components/ui/radio.tsx";
import {
  Tags,
  UserProfileFormValue,
} from "@/routes/_app/profile.edit-info.tsx";
import {UserProfile} from "@/lib/interface.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export function EditProfileForm(props: {
  profile: UserProfile;
  form: UseFormReturn<UserProfileFormValue>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  tagsData: Tags[];
}) {
  const {tagsData, form, profile} = props;
  const {control, onSubmit, register, setValue, formState} = form;
  const errors = formState.errors;
  const initCoordinates = useCoordinate();
  const [coordinates, setCoordinates] = useState<UserCoordinates>(null);
  const [address, setAddress] = useState<string>("");

  const [userTags, setUserTags] = useState<number[]>(profile.tags ? Object.values(profile.tags) : []);

  const tags = useController({
    control,
    name: "tags",
    defaultValue: [],
  });

  // const invalidTags = !!errors.tags;

  useEffect(() => {
    if (profile.coordinates.length > 0) {
      console.log("Profile coordinates:", profile.coordinates);
      setCoordinates(profile.coordinates);
      setValue("coordinates", profile.coordinates);
      GetAddressFromString(profile.coordinates).then((address) => {
        if (!address) return;
        setAddress(address);
      });
      return;
    }
  }, []);

  useEffect(() => {
    if (coordinates) return;

    if (!initCoordinates) return;
    console.log("Init coordinates:", initCoordinates);

    if (initCoordinates.access) {
      GetAddressFromCoordinates(initCoordinates.latitude, initCoordinates.longitude).then((address) => {
        if (!address) return;
        setAddress(address);
      });
    }

    console.log("Address", address);
  }, [initCoordinates]);

  useEffect(() => {
    if (!coordinates) return;

    GetAddressFromCoordinates(coordinates.latitude, coordinates.longitude).then((address) => {
      if (!address) return;
      setAddress(address);
    });

    console.log("Address set by user:", address);
  }, [coordinates]);

  useEffect(() => {
    console.log("User tags:", userTags);
    setValue("tags", userTags, {
      shouldValidate: true,
    });
    console.log("Set tags:", tags.field.value);
  }, [userTags]);

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
                    <Field.RequiredIndicator/>
                  </Field.Label>
                  <Input {...register("firstName")} />
                  <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root required invalid={!!errors.lastName}>
                  <Field.Label>
                    Last name
                    <Field.RequiredIndicator/>
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
                  <Field.RequiredIndicator/>
                </Field.Label>
                <Input
                  {...register("coordinates")}
                  value={address}
                  onBlur={async () => {
                    console.log("On blur:", address);
                    const result = await GetCoordinates(address);
                    setCoordinates(result);
                    setValue("coordinates", result?.latitude.toString() + ',' + result?.longitude.toString(), {
                      shouldValidate: true,
                    });
                  }}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
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
              onValueChange={tags.field.onChange}
              name={tags.field.name}
              value={userTags}
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

function TagCheckbox({
                       tag,
                       userTags,
                       setUserTags,
                     }: {
  tag: Tags;
  userTags: number[];
  setUserTags: (tags: number[]) => void;
}) {
  const [checked, setChecked] = useState(userTags.includes(tag.id));

  return (
    <Checkbox
      minW={"100px"}
      checked={checked}
      onCheckedChange={(e) => {
        setChecked(e.checked);

        if (e.checked && !userTags.includes(tag.id)) {
          setUserTags([...userTags, tag.id]);
        } else if (!e.checked && userTags.includes(tag.id)) {
          setUserTags(userTags.filter((userTag) => userTag !== tag.id));
        }
      }}
    >
      {tag.name}
    </Checkbox>
  );
}
