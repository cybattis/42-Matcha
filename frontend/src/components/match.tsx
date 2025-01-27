import {
  Text,
  HStack,
  Circle,
  Float,
  Stack
} from "@chakra-ui/react";
import {Avatar} from "@/components/ui/avatar"

export function MatchList() {
  return (
    <Stack gap="2" w={'250px'}>
      {users.map((user) => (
        <HStack key={user.email} w={'250px'} gap="4" borderWidth="1px" rounded="md" p={2}>
          <Avatar name={user.name} size="lg" src={user.avatar}>
            <Float placement="bottom-end" offsetX="1" offsetY="1">
              <Circle
                bg="green.500"
                size="8px"
                outline="0.2em solid"
                outlineColor="bg"
              />
            </Float>
          </Avatar>
          <Text fontWeight="medium">{user.name}</Text>
        </HStack>
      ))}
    </Stack>
  );
}

const users = [
  {
    id: "1",
    name: "John Mason",
    email: "john.mason@example.com",
    avatar: "https://i.pravatar.cc/300?u=iu",
  },
  {
    id: "2",
    name: "Melissa Jones",
    email: "melissa.jones@example.com",
    avatar: "https://i.pravatar.cc/300?u=po",
  },
]