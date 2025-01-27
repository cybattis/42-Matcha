import {createFileRoute} from '@tanstack/react-router'
import {Button, Flex, HStack, Input, Stack, Text} from '@chakra-ui/react'
import {useEffect, useRef} from 'react'
import {MatchList} from '@/components/match.tsx'

export const Route = createFileRoute('/app/match')({
  component: RouteComponent,
})

type MessageProps = {
  text: string
  actor: 'user' | 'bot'
}
const Message = ({text, actor}: MessageProps) => {
  return (
    <Flex
      py={2}
      px={4}
      bg={actor === 'user' ? 'blue.500' : 'gray.100'}
      color={actor === 'user' ? 'white' : 'gray.600'}
      borderRadius="lg"
      w="fit-content"
      alignSelf={actor === 'user' ? 'flex-end' : 'flex-start'}
    >
      <Text>{text}</Text>
    </Flex>
  )
}

function RouteComponent() {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }, [])

  return (
    <HStack w={'fit-content'} justifyContent={'center'} alignItems={'flex-start'} gap={3} justifySelf={'center'}>
      <MatchList/>
      <Flex
        flexDirection="column"
        w="lg"
        m="auto"
        maxH="2xl"
        borderWidth="1px"
        roundedTop="lg"
      >
        <Stack
          px={4}
          py={8}
          overflowY="auto"
          scrollBehavior="smooth"
          flex={1}
          ref={messagesEndRef}
        >
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
          <Message text="Hi" actor="user"/>
          <Message text="How may I help you?" actor="bot"/>
        </Stack>
        <HStack p={4} bg="gray.100">
          <Input bg="white" placeholder="Enter your text"/>
          <Button colorScheme="blue">Send</Button>
        </HStack>
      </Flex>
    </HStack>
  )
}
