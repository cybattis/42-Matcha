import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  Box,
  HStack,
  Badge,
  Image,
  IconButton,
  VStack,
  Flex,
} from '@chakra-ui/react'
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@/components/ui/pagination'
import { LikeIcon, ProfileIcon } from '@/components/Icons.tsx'

export const Route = createFileRoute('/_app/search')({
  component: RouteComponent,
})

function UserCard({ users }: { users: UserCardType }) {
  return (
    <Card.Root
      flexDirection="row"
      overflow="hidden"
      maxH={{ base: '100px', md: '200px' }}
      w={{ base: '100%', md: '100%' }}
      maxW="xl"
      key={users.id}
    >
      <Image
        objectFit="cover"
        maxW={{ base: '100px', md: '200px' }}
        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
        alt="Caffe Latte"
      />
      <Box>
        <Card.Body p={2}>
          <Card.Title mb="2">
            {users.name} - {users.age}
          </Card.Title>
          <Card.Description>
            <Flex gap="2" wrap="wrap">
              {users.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </Flex>
          </Card.Description>
        </Card.Body>
      </Box>
      <Card.Footer
        p={0}
        pr={4}
        flexDirection={'column'}
        justifyContent={'center'}
      >
        <IconButton variant={'ghost'} size={{ sm: 'sm' }}>
          <LikeIcon />
        </IconButton>
        <IconButton variant={'ghost'} size={{ sm: 'sm' }}>
          <ProfileIcon />
        </IconButton>
      </Card.Footer>
    </Card.Root>
  )
}

function RouteComponent() {
  return (
    <VStack
      w={'fit-content'}
      alignItems={'center'}
      gap={3}
      justifySelf={'center'}
    >
      <HStack></HStack>
      {users.map((user) => (
        <UserCard users={user} />
      ))}
      <PaginationRoot count={20} pageSize={2} defaultPage={1}>
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </VStack>
  )
}

interface UserCardType {
  id: string
  name: string
  age: string
  avatar: string
  tags: string[]
}

const users = [
  {
    id: '1',
    name: 'John Mason',
    age: '32',
    avatar: 'https://i.pravatar.cc/300?u=iu',
    tags: ['Football', 'Lecture', 'Cinema'],
  },
  {
    id: '2',
    name: 'Melissa Jones',
    age: '33',
    avatar: 'https://i.pravatar.cc/300?u=po',
    tags: ['Football', 'Lecture', 'Cinema', 'Voyage', 'Yoga'],
  },
]
