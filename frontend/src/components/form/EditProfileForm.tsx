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
  UseFormSetValue,
} from "react-hook-form";
import { FormEventHandler, useEffect, useState } from "react";
import { useCoordinate } from "@/lib/useCoordinate.ts";
import { Radio, RadioGroup } from "@/components/ui/radio.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  Tags,
  UserProfileFormValue,
} from "@/routes/_app/profile.edit-info.tsx";
import axios from "axios";

export function EditProfileForm(props: {
  formState: FormState<UserProfileFormValue>;
  register: UseFormRegister<UserProfileFormValue>;
  control: Control<UserProfileFormValue>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  tagsData: Tags[];
  setValue: UseFormSetValue<UserProfileFormValue>;
}) {
  const { formState, tagsData, onSubmit, register, control, setValue } = props;
  const errors = formState.errors;

  const initCoordinates = useCoordinate();
  const [coordinates, setCoordinates] = useState<string>(
    initCoordinates.lat + "," + initCoordinates.lon
  );
  const [address, setAddress] = useState<string>("");

  const tags = useController({
    control,
    name: "tags",
    defaultValue: [],
  });

  async function GetAddress(lat: number | undefined, lon: number | undefined) {
    if (!lat || !lon) {
      return;
    }

    const reverseGeocoding = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`
    );
    const { city, postcode, road, suburb, town } =
      reverseGeocoding.data.address;
    const displayLocation = `${road}, ${suburb ? `${suburb},` : ""}${postcode}, ${city || town}`;

    console.log(displayLocation);
    setAddress(displayLocation);
  }

  async function GetCoordinates(address: string) {
    const parsedAddress = address.replace(/ /g, "+");

    console.log("GetCoordinates:", parsedAddress);
    const reverseGeocoding = await axios.get(
      `http://nominatim.openstreetmap.org/search?q=${parsedAddress}&format=jsonv2`
    );

    if (reverseGeocoding.data.length === 0) return;

    const { lat, lon } = reverseGeocoding.data[0] as {
      lat: string;
      lon: string;
    };

    console.log("NEW CORD", lat.substring(0, 10), lon.substring(0, 10));
    setCoordinates(lat.substring(0, 10) + "," + lon.substring(0, 10));
  }

  const invalidTags = !!errors.tags;

  useEffect(() => {
    console.log("Init coordinates:", initCoordinates);
    GetAddress(initCoordinates.lat, initCoordinates.lon).then();
  }, [initCoordinates.lat, initCoordinates.lon]);

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
                  value={address}
                  onBlur={async () => {
                    console.log("On blur:", address);
                    await GetCoordinates(address);
                    setValue("coordinates", coordinates, {
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
