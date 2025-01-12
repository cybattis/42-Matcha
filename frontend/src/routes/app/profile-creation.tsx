import { createFileRoute, Navigate } from "@tanstack/react-router";
import axios from "axios";
import { VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster.tsx";
import { ToasterSuccess } from "@/lib/toaster.ts";
import { CreateProfileForm } from "@/components/form/CreateProfileForm.tsx";
import { useAuth } from "@/auth.tsx";

export const Route = createFileRoute("/app/profile-creation")({
  component: RouteComponent,
});

export interface UserProfileFormValue {
  firstName: string;
  lastName: string;
  gender: number;
  SexualOrientation: number;
  biography: string;
  coordinates: string;
  tags: number[];
}

async function CreateProfile(token: string | null, data: UserProfileFormValue) {
  const response = await axios.post("/UserProfile/Update", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

function RouteComponent() {
  const form = useForm<UserProfileFormValue>();
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  const onSubmit = form.handleSubmit(async (data) => {
    const token = useAuth().token;
    const t = toaster.loading({ title: "Création de compte en cours..." });
    const result = await CreateProfile(token, data);

    console.log(result);

    if (result.error) {
      result.error.userName &&
        toaster.error({
          title: "Erreur",
          description: result.error.userName,
        });
      result.error.password &&
        toaster.error({
          title: "Erreur",
          description: result.error.password,
        });
      result.error.mail &&
        toaster.error({ title: "Erreur", description: result.error.mail });
      result.error.birthDate &&
        toaster.error({
          title: "Erreur",
          description: result.error.birthDate,
        });
    } else {
      setIsProfileCreated(true);
      ToasterSuccess(
        "Compte créé !",
        "Veuillez vérifier votre boîte mail pour activer votre compte.",
        10000
      );
    }

    toaster.remove(t);
  });

  return (
    <VStack gap={6} align={"center"}>
      <CreateProfileForm onSubmit={onSubmit} form={form} />
      {isProfileCreated ? <Navigate to={"/"} /> : null}
    </VStack>
  );
}
