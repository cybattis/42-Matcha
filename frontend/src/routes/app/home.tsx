import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/home')({
  component: RouteComponent,
});

function loader() {
  const response = await fetch('http://localhost:5163/get/'+ id, {
}

function RouteComponent() {
  return <div>Hello "/app/home"!</div>;
}
