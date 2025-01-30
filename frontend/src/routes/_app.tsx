import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    console.log("App layout");
    console.log("Location: ", location);
    if (!context.auth.isAuthenticated) {
      console.log("User is not authenticated");
      throw redirect({
        to: "/auth/login",
      });
    } else if (location.pathname !== "/profile/edit-info") {
      context.auth.appStatus();
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
