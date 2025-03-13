import {
  createFileRoute,
  Outlet,
  ParsedLocation,
  redirect,
} from "@tanstack/react-router";
import { MyRooterContext } from "@/routes/__root.tsx";
import Navbar from "@/components/navigation/Navbar.tsx";
import { Box } from "@chakra-ui/react";
import { GetMeProfile } from "@/lib/query.ts";
import { ProfileStatus, UserProfile } from "@/lib/interface.ts";
import { createContext, useState } from "react";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async ({ context }: { context: MyRooterContext }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth/login",
      });
    }
  },
  loader: async ({
    context,
    location,
  }: {
    context: MyRooterContext;
    location: ParsedLocation;
  }) => {
    const profile = await GetMeProfile(context.auth.token);
    if (!profile) {
      await context.auth.logout();
      redirect({
        to: "/auth/login",
      });
      return;
    }

    console.log("Checking profile status");
    const search = new URLSearchParams(location.search);

    if (
      profile.status === ProfileStatus.INFO &&
      location.pathname !== "/profile/edit-info"
    ) {
      throw redirect({
        to: "/profile/edit-info",
      });
    } else if (
      profile.status === ProfileStatus.IMAGES &&
      location.pathname !== "/profile/edit-images"
    ) {
      throw redirect({
        to: "/profile/edit-images",
      });
    } else if (
      profile.status === ProfileStatus.COMPLETED &&
      !search.get("fromProfile") &&
      location.pathname === "/profile/edit-images"
    ) {
      throw redirect({
        to: "/home",
      });
    }

    return profile;
  },
});

export interface IUserContext {
  profileData: UserProfile;
  setProfileData: (user: UserProfile) => void;
}

export const UserContext = createContext<IUserContext | null>(null);

function RouteComponent() {
  const data = Route.useLoaderData() as UserProfile;
  const [profileData, setProfileData] = useState<UserProfile>(data);

  return (
    <UserContext.Provider value={{ profileData, setProfileData }}>
      <Navbar />
      <Box flexGrow="1" p={5}>
        <Outlet />
      </Box>
    </UserContext.Provider>
  );
}
