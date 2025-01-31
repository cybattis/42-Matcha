import {createFileRoute, getRouteApi, Navigate, redirect,} from "@tanstack/react-router";
import {MyRooterContext} from "@/routes/__root.tsx";
import axios from "axios";
import {ToasterError, ToasterSuccess} from "@/lib/toaster.ts";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {IAuthContext} from "@/auth.tsx";
import {toaster} from "@/components/ui/toaster.tsx";
import {VStack} from "@chakra-ui/react";
import {EditProfileForm} from "@/components/form/EditProfileForm.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

export const Route = createFileRoute("/_app/profile/edit-info")({
  component: RouteComponent,
  loader: async ({ context }: { context: MyRooterContext }) => {
    return await fetchTags(context.auth);
  },
});

export interface Tags {
  id: number;
  name: string;
}

const formSchema = z.object({
  firstName: z.string().nonempty({
    message: "First name is required",
  }),
  lastName: z.string().nonempty({
    message: "Last name is required",
  }),
  gender: z.number(),
  sexualOrientation: z.number(),
  biography: z.string(),
  coordinates: z.string(),
  tags: z.array(z.string()),
});

export type UserProfileFormValue = z.infer<typeof formSchema>;

async function UpdateProfile(token: string | null, data: UserProfileFormValue) {
    const profile = await axios.post("/UserProfile/Update", {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        sexualOrientation: data.sexualOrientation,
        biography: data.biography,
        coordinates: data.coordinates,
    }, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      console.log("Profile", res.response);
      return res;
    })
    .catch((err) => {
      console.log("Profile", err.response);
      return err.response;
    });
    
    if (profile.status !== 200) {
      return profile;
    }

  return await axios.post("/Tags/Update", {
      tags: data.tags,
    }, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      console.log("Tags", res);
      return res;
    })
    .catch((err) => {
      return err;
    });
}

async function fetchTags(auth: IAuthContext): Promise<Tags[]> {
  const token = "Bearer " + auth.token;
  console.log(token);
  try {
    const res = await axios.get("/Tags/GetList", {
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        Authorization: token,
      },
    });
    return res.data;
  } catch (err) {
    if (err.response.status === 401) {
      await auth.logout();
      throw redirect({
        to: "/auth/login",
      });
    }
    console.log(err);
    ToasterError("Erreur serveur", "Impossible de récupérer la liste des tags");
    return [];
  }
}

function RouteComponent() {
  const routeApi = getRouteApi("/_app/profile/edit-info");
  const tags = routeApi.useLoaderData() as Tags[];
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  const { handleSubmit, register, formState, control } =
    useForm<UserProfileFormValue>({
      resolver: zodResolver(formSchema),
    });

  const onSubmit = handleSubmit(async (data: UserProfileFormValue) => {
    console.log(data);
    const t = toaster.loading({ title: "Création de compte en cours..." });
    const token = localStorage.getItem("token");
    const result = await UpdateProfile(token, data);

    console.log("RESULT:", result.statusText);

    if (result.status !== 200) {
        ToasterError(result.)
    } else {
      ToasterSuccess('Profile Updated')
    }

    toaster.remove(t);
  });

  return (
    <VStack gap={6} align={"center"}>
      <EditProfileForm
        onSubmit={onSubmit}
        register={register}
        control={control}
        formState={formState}
        tagsData={tags}
      />
      {isProfileCreated ? <Navigate to={"/profile/edit-images"} /> : null}
    </VStack>
  );
}
