import {createFileRoute, useParams} from '@tanstack/react-router'
import {GetUserProfile} from "@/lib/query.ts";
import {MyRooterContext} from "@/routes/__root.tsx";
import {Profile} from "@/components/pages/Profile.tsx";
import {UserProfile} from "@/lib/interface.ts";

export const Route = createFileRoute('/_app/profile/$username')({
  component: RouteComponent,
  loader: async ({context, params}: { context: MyRooterContext }) => {
    const {username} = params as { username: string };
    const profile = await GetUserProfile(username, context.auth);
    return {profile}
  }
})

function RouteComponent() {
  const {profile} = Route.useLoaderData() as UserProfile;

  return (
    <Profile data={profile} isMe={false}/>
  )
}
