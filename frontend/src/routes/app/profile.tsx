import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { UserProfile } from "@/lib/interface.ts";
import { MyRooterContext } from "@/routes/__root.tsx";

export const Route = createFileRoute("/app/profile")({
  component: RouteComponent,
  loader: ({ context }: { context: MyRooterContext }) =>
    loader(context.auth.token),
});

async function loader(token: string | null) {
  const response = await axios.get("/UserProfile/Me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data as UserProfile;
}

function RouteComponent() {
  return <div>Hello "/profile"!</div>;
}
