import {createFileRoute} from '@tanstack/react-router'
import {
  Button,
  Flex, Heading,
  HStack,
  IconButton,
  Input,
  MenuContent, MenuItem,
  MenuRoot,
  MenuTrigger,
  Stack,
  Text, VStack
} from '@chakra-ui/react'
import {useEffect, useRef, useState} from 'react'
import {MatchList} from '@/components/MatchList.tsx'
import {ChatOptionIcon} from "@/components/Icons.tsx";

export const Route = createFileRoute('/app/match')({
  component: RouteComponent,
})

type MessageProps = {
  id: string
  text: string
  timestamp: Date
  actor: 'user' | 'bot'
}

export type MatchListType = {
  id: string
  name: string
  avatar: string
  chat: MessageProps[]
}

const Message = ({message}: { message: MessageProps }) => {
  const date = new Date(parseInt(message.timestamp));
  const time = date ? date.toLocaleTimeString() : '';

  return (
    <VStack key={message.id} w="fit-content" alignSelf={message.actor === 'user' ? 'flex-end' : 'flex-start'} gap={1}>
      <Flex
        py={2}
        px={4}
        bg={message.actor === 'user' ? 'blue.500' : 'gray.100'}
        color={message.actor === 'user' ? 'white' : 'gray.600'}
        borderRadius="lg"
        w="fit-content"
      >
        <Text>{message.text}</Text>
      </Flex>
      <Text fontSize="2xs" ml={2} color="gray.400" alignSelf={message.actor === 'user' ? 'flex-end' : 'flex-start'}>
        {time}
      </Text>
    </VStack>
  )
}

function MatchOption() {
  return (
    <MenuRoot positioning={{placement: "right-start"}}>
      <MenuTrigger asChild>
        <IconButton variant="ghost" size="sm">
          <ChatOptionIcon/>
        </IconButton>
      </MenuTrigger>
      <MenuContent pos="absolute" right="-115px">
        <MenuItem value="block">Block 🛇</MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}


function RouteComponent() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [id, setId] = useState('');
  let [chat, setChat] = useState<MessageProps[]>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }

    const currentUser = users.find(user => user.id === id);
    if (currentUser)
      setChat(currentUser.chat);
  }, [id])

  return (
    <VStack>
      <Heading>Match and Chat</Heading>
      <HStack w={'fit-content'} justifyContent={'center'} alignItems={'flex-start'} gap={3} justifySelf={'center'}>
        <Stack gap="2" w={'250px'}>
          {users.map((user: MatchListType) => (
            <MatchList props={user} setId={setId}/>
          ))}
        </Stack>
        {chat ?
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
              {chat && chat.map((message) => (
                <Message message={message}/>
              ))}
            </Stack>
            <HStack p={4} bg="gray.100" position="relative">
              <Input bg="white" placeholder="Enter your text"/>
              <Button colorScheme="blue">Send</Button>
              <MatchOption/>
            </HStack>
          </Flex> : null}
      </HStack>
    </VStack>
  )
}

const users = [
  {
    id: "1",
    name: "John Mason",
    avatar: "https://i.pravatar.cc/300?u=iu",
    chat: [
      {
        id: "1",
        text: "Hi John",
        timestamp: '1737991939',
        actor: "user",
      },
      {
        id: "2",
        text: "Hello User",
        timestamp: '1737991939',
        actor: "bot",
      },
      {
        id: "3",
        text: "How are you doing?",
        timestamp: '1737991939',
        actor: "bot",
      },
      {
        id: "4",
        text: "I'm fine !",
        timestamp: '1737992039',
        actor: "user",
      },
    ],
  },
  {
    id: "2",
    name: "Melissa Jones",
    email: "melissa.jones@example.com",
    avatar: "https://i.pravatar.cc/300?u=po",
    chat: [
      {
        id: "1",
        text: "Hi Melissa",
        timestamp: '',
        actor: "user",
      },
      {
        id: "2",
        text: "Hello",
        timestamp: '',
        actor: "bot",
      },
      {
        id: "3",
        text: "How may I help you?",
        timestamp: '',
        actor: "bot",
      },
      {
        id: "4",
        text: "HEEEEEEEEEEEEE",
        timestamp: '',
        actor: "user",
      },
    ],
  },
]