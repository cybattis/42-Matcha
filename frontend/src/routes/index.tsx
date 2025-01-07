import { createFileRoute, redirect } from '@tanstack/react-router';
import { isAuthenticated } from '@/lib/auth.ts';

export const Route = createFileRoute('/')({
  component: Index,
  beforeLoad: async ({ location }) => {
    if (isAuthenticated()) {
      throw redirect({
        to: '/app/home',
      });
    } else {
      throw redirect({
        to: '/auth/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
});

function Index() {
  return;
}
