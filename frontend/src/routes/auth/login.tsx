import { createFileRoute } from '@tanstack/react-router'
import { Text, VStack } from '@chakra-ui/react'
import { LoginForm } from '@/components/LoginForm.tsx'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <VStack gap={6} align={'center'}>
      <Text>MATCHA</Text>
      <LoginForm />
    </VStack>
  )
}
