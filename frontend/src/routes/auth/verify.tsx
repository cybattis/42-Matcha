import {createFileRoute} from '@tanstack/react-router'
import {Center, VStack} from "@chakra-ui/react";

export const Route = createFileRoute('/auth/verify')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Center>
      <VStack>
        <p>You've not confirmed your email.</p>
        <p>Please check your email for a confirmation link.</p>
      </VStack>
    </Center>
  )
}
