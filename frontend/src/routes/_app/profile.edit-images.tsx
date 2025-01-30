import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/profile/edit-images")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/profile/edit-images"!</div>;
}
