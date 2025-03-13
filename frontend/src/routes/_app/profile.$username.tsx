import {createFileRoute, useParams} from '@tanstack/react-router'
import {GetUserProfile} from "@/lib/query.ts";
import {MyRooterContext} from "@/routes/__root.tsx";
import {Profile} from "@/components/pages/Profile.tsx";
import {UserProfile} from "@/lib/interface.ts";

export const Route = createFileRoute('/_app/profile/$username')({
  component: RouteComponent,
  beforeLoad: async ({context}: { context: MyRooterContext }) => {
    console.log("Before load: Profile username");
    const {username} = this.useParams();
    const profile = await GetUserProfile(username, context.auth.token);
    return {profile}
  }
})

function RouteComponent() {
  const {data} = Route.useLoaderData() as UserProfile;

  return (
    <Profile data={data} isMe={false}/>
  )
}
