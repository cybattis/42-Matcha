import {
  createFileRoute,
  Outlet,
  ParsedLocation,
  redirect,
} from "@tanstack/react-router";
import { MyRooterContext } from "@/routes/__root.tsx";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async ({
    context,
    location,
  }: {
    context: MyRooterContext;
    location: ParsedLocation;
  }) => {
    console.log("Auth layout");
    console.log("Location: ", location);
    if (context.auth.isAuthenticated) {
      console.log("User is authenticated");
      throw redirect({
        to: "/home",
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
