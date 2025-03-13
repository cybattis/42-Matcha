import {
  createFileRoute,
  Outlet,
  ParsedLocation,
  redirect, useLoaderData,
} from "@tanstack/react-router";
import {MyRooterContext} from "@/routes/__root.tsx";
import Navbar, {NavbarAuth} from "@/components/navigation/Navbar.tsx";
import {IAuthContext, useAuth} from "@/auth.tsx";
import {Box} from "@chakra-ui/react";
import {GetMeProfile} from "@/lib/query.ts";
import {ProfileStatus, UserProfile} from "@/lib/interface.ts";
import {createContext, useState} from "react";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async ({
                       context,
                       location,
                     }: {
    context: MyRooterContext;
    location: ParsedLocation;
  }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth/login",
      });
    }
  },
  loader: async ({context}: { context: MyRooterContext }) => {
    const profile = await GetMeProfile(context.auth.token);
    if (!profile) {
      await context.auth.logout();
      redirect({
        to: "/auth/login",
      });
      return;
    }

    if (profile.status === ProfileStatus.INFO && location.pathname !== "/profile/edit-info") {
      throw redirect({
        to: "/profile/edit-info",
      });
    } else if (profile.status === ProfileStatus.IMAGES && location.pathname !== "/profile/edit-images") {
      throw redirect({
        to: "/profile/edit-images",
      });
    } else if (
      profile.status === ProfileStatus.COMPLETED &&
      location.pathname === "/profile/edit-images"
    ) {
      throw redirect({
        to: "/home",
      });
    }

    return profile;
  }
});

export interface IUserContext {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

export const UserContext = createContext<IUserContext | null>(null);

function RouteComponent() {
  const data = Route.useLoaderData() as UserProfile;
  const [user, setUser] = useState<UserProfile>(data);

  return (
    <UserContext.Provider value={{user, setUser}}>
      <Navbar/>
      <Box flexGrow="1" p={5}>
        <Outlet/>
      </Box>
    </UserContext.Provider>
  );
}
