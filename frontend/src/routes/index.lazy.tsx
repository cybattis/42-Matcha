import {Text, VStack} from "@chakra-ui/react";
import {LoginForm} from "@/components/LoginForm.tsx";
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
      <VStack gap={6} align={"center"}>
        <Text>MATCHA</Text>
        <LoginForm />
      </VStack>
  )
}

export default Index