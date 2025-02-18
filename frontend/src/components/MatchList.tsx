import {
  Text,
  HStack,
  Circle,
  Float,
  Button, IconButton,
} from "@chakra-ui/react";
import {Avatar} from "@/components/ui/avatar"
import {useNavigate} from "@tanstack/react-router";
import {ConversationIcon} from "@/components/Icons.tsx";
import {MatchListType} from "@/routes/_app/match.tsx";

export function MatchList({props, setId}: { props: MatchListType; setId: (value: number) => void }) {
  const navigate = useNavigate();
  return (
    <HStack key={props.id} gap="4" w={'250px'} h='fit-content' rounded="md" p={2} borderWidth="1px"
            borderColor="gray.200">
      <Button variant={'ghost'}
              onClick={async () => {
                await navigate({to: '/profile/' + props.id});
              }}>
        <Avatar name={props.name} size="lg" src={props.avatar}>
          <Float placement="bottom-end" offsetX="1" offsetY="1">
            <Circle
              bg="green.500"
              size="8px"
              outline="0.2em solid"
              outlineColor="bg"
            />
          </Float>
        </Avatar>
      </Button>
      <Text fontWeight="medium">{props.name}</Text>
      <IconButton variant={'ghost'}
                  onClick={() => {
                    setId(props.id);
                  }}>
        <ConversationIcon/>
      </IconButton>
    </HStack>
  );
}
