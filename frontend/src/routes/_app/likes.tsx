import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/likes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/likes"!</div>
}
