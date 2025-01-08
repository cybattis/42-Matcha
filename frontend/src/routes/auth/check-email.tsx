import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/check-email')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/check-email"!</div>
}
