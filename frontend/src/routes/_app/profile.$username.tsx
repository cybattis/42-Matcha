import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile/$username')({
  component: RouteComponent,
})

function RouteComponent() {
  const { username } = Route.useParams()

  return <div>Hello "/profile"! {username}</div>
}
