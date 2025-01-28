import {
  createFileRoute,
  getRouteApi,
  ParsePathParams,
  useLoaderData,
  useParams,
} from '@tanstack/react-router'
import axios from 'axios'
import { UserProfile } from '@/lib/interface.ts'
import { MyRooterContext } from '@/routes/__root.tsx'

export const Route = createFileRoute('/app/profile/$username')({
  component: RouteComponent,
  // loader: ({context, params}: { context: MyRooterContext; params: ParsePathParams<string> }) =>
  //   loader(context.auth.token, params),
})

async function loader(token: string | null, username: string) {
  const response = await axios.get('/UserProfile/' + username)
  return response.data as UserProfile
}

function RouteComponent() {
  const { username } = Route.useParams()

  return <div>Hello "/profile"! {username}</div>
}
