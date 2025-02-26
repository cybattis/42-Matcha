import {
  createFileRoute,
  Outlet,
  ParsedLocation,
  redirect,
} from "@tanstack/react-router";
import { MyRooterContext } from "@/routes/__root.tsx";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async ({
    context,
    location,
  }: {
    context: MyRooterContext;
    location: ParsedLocation;
  }) => {
    console.log("App layout");
    console.log("Location: ", location);
    if (!context.auth.isAuthenticated) {
      console.log("User is not authenticated");
      throw redirect({
        to: "/auth/login",
      });
    } else if (
      location.pathname !== "/profile/edit-info" &&
      location.pathname !== "/profile/edit-images"
    ) {
      const status = await context.auth.appStatus();

      if (status === "Info") {
        throw redirect({
          to: "/profile/edit-info",
        });
      } else if (status === "Images") {
        throw redirect({
          to: "/profile/edit-images",
        });
      } else if (status === "Complete") {
        throw redirect({
          to: "/home",
        });
      }
    }
  },
  loader: async () => {},
});

function RouteComponent() {
  return <Outlet />;
}
