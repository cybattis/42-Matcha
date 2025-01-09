import {createFileRoute, getRouteApi, redirect} from '@tanstack/react-router';
import {MyRooterContext} from "@/routes/__root.tsx";

export const Route = createFileRoute('/app/home')({
  component: RouteComponent,
  beforeLoad: async ({context}: { context: MyRooterContext }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      });
    }
    const profile = await loader(context.auth.token);
    console.log(profile);
    if (!profile.isVerified) {
      throw redirect({
        to: '/auth/verify',
      });
    }
  },
  loader: ({context}: { context: MyRooterContext }) => loader(context.auth.token),
});

async function loader(token: string) {

  const response = await fetch('http://localhost:5163/UserProfile/Me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  });
  return response.json();
}

function RouteComponent() {
  const profile = getRouteApi('/app/home').useLoaderData() as UserProfile;

  if (!profile) {
    return <div>Loading...</div>;
  }

  if (!profile.isVerified) {
    redirect({
      to: '/auth/verify',
    })
  }
  console.log(profile);

  return <div>/app/home</div>;
}
