import {createFileRoute, Link, redirect} from '@tanstack/react-router';
import {MyRooterContext} from "@/routes/__root.tsx";
import {Box, Center, VStack} from "@chakra-ui/react";

export const Route = createFileRoute('/')({
  beforeLoad: ({context, location}: { context: MyRooterContext }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: 'auth/login',
        search: {
          redirect: location.href,
        },
      })
    } else {
      throw redirect({
        to: 'app/home',
      });
    }
  },
  component: Index,
});

function Index() {
  return;
}
