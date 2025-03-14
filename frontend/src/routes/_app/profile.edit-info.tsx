import {createFileRoute, redirect, useNavigate} from "@tanstack/react-router";
import {MyRooterContext} from "@/routes/__root.tsx";
import {ToasterSuccess} from "@/lib/toaster.ts";
import {useForm} from "react-hook-form";
import {toaster} from "@/components/ui/toaster.tsx";
import {VStack} from "@chakra-ui/react";
import {EditProfileForm} from "@/components/form/EditProfileForm.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {ProfileStatus, Tags} from "@/lib/interface.ts";
import {FetchTagsList, UpdateProfile} from "@/lib/query.ts";
import {useAuth} from "@/auth.tsx";
import {useContext} from "react";
import {IUserContext, UserContext} from "@/routes/_app.tsx";

export const Route = createFileRoute("/_app/profile/edit-info")({
  component: RouteComponent,
  loader: async ({context}: { context: MyRooterContext }) => {
    return await FetchTagsList(context.auth);
  },
});

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
  address: z.string(),
  tags: z.array(z.number()).min(1, {
    message: "At least one tag is required",
  }).max(5, {
    message: "Maximum of 5 tags",
  }),
});
export type UserProfileFormValue = z.infer<typeof formSchema>;

function RouteComponent() {
  const auth = useAuth();
  const navigate = useNavigate({from: Route.fullPath});
  const {profileData, setProfileData} =
  (useContext(UserContext) as IUserContext) || {};
  const tags = Route.useLoaderData() as Tags[];

  const form = useForm<UserProfileFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: profileData.firstName || "",
      lastName: profileData.lastName || "",
      biography: profileData.biography || "",
      coordinates: profileData.coordinates || "",
      address: profileData.address || "",
      tags: profileData.tags ? Object.values(profileData.tags) : [],
    },
  });

  const onSubmit = form.handleSubmit(async (data: UserProfileFormValue) => {
    const isCreation = profileData.status !== ProfileStatus.COMPLETED;

    const t = toaster.loading({
      title: isCreation
        ? "Création de compte en cours..."
        : "Mise à jour du profil en cours...",
    });
    const result = await UpdateProfile(auth, data);
    toaster.remove(t);

    if (result.status === 401) {
      await auth.logout();
      return;
    }

    if (result.status === 200) {
      ToasterSuccess("Profil mis à jour avec succès");
      setProfileData({
        ...profileData,
        ...data,
        tags: data.tags,
      });
      if (isCreation) await navigate({to: "/profile/edit-images"});
      else await navigate({to: "/profile/me"});
    }
  });

  return (
    <VStack gap={6} align={"center"}>
      <EditProfileForm
        profile={profileData}
        form={form}
        onSubmit={onSubmit}
        tagsData={tags}
      />
    </VStack>
  );
}
