import { createFileRoute, getRouteApi, Navigate } from "@tanstack/react-router";
import axios from "axios";
import { VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster.tsx";
import { ToasterError, ToasterSuccess } from "@/lib/toaster.ts";
import { CreateProfileForm } from "@/components/form/CreateProfileForm.tsx";
import { useAuth } from "@/auth.tsx";
import { MyRooterContext } from "@/routes/__root.tsx";

export const Route = createFileRoute("/app/profile-creation")({
  component: RouteComponent,
  loader: async ({ context }: { context: MyRooterContext }) => {
    return fetchTags(context.auth.token);
  },
});

export interface UserProfileFormValue {
  firstName: string;
  lastName: string;
  gender: number;
  sexualOrientation: number;
  biography: string;
  coordinates: string;
  tags: number[];
}

interface Tags {
  id: number;
  name: string;
}

async function createProfile(token: string | null, data: UserProfileFormValue) {
  const response = await axios
    .post("/UserProfile/Update", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((err) => console.log(err));
  return response;
}

async function fetchTags(token: string | null): Promise<Tags[]> {
  try {
    const res = await axios.get("/Tags/GetList", {
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        Authorization: "Bearer ",
      },
    });
    if (res.status === 401) {
      ToasterError("Erreur", "Vous n'êtes pas connecté");
      return [];
    }
    return res.data;
  } catch (err) {
    console.log(err);
    ToasterError("Erreur serveur", "Impossible de récupérer la liste des tags");
    return [];
  }
}

function RouteComponent() {
  const routeApi = getRouteApi("/app/profile-creation");
  const data = routeApi.useLoaderData() as Tags[];

  // const [tagsList, setTagsList] = useState<Tags[]>([]);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const form = useForm<UserProfileFormValue>();
  // const tagsListData = Route.useLoaderData() as Tags[];

  const onSubmit = form.handleSubmit(async (data) => {
    const token = useAuth().token;
    const t = toaster.loading({ title: "Création de compte en cours..." });
    const result = await createProfile(token, data);

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

  useEffect(() => {
    if (data) {
      // tagsListData.forEach((tag: Tags) => console.log(tag.name));
      console.log(data);
      // setTagsList(tagsListData);
    }
  }, [data]);

  return (
    <VStack gap={6} align={"center"}>
      <CreateProfileForm onSubmit={onSubmit} form={form} />
      <p>Tags:</p>
      {data
        ? data.map((tag: Tags) => <div key={tag.id}>Tags: {tag.name}</div>)
        : null}
      {isProfileCreated ? <Navigate to={"/"} /> : null}
    </VStack>
  );
}
