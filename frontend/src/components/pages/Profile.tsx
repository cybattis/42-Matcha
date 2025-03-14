import {Badge, Button, Flex, Text} from "@chakra-ui/react";
import {DefaultAvatar, EditIcon, EditImages} from "@/components/Icons.tsx";
import {UserImage} from "@/components/UserImage.tsx";
import {UserProfile} from "@/lib/interface.ts";
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/_app/profile.me.tsx";

export function Profile({data, isMe}: { data: UserProfile; isMe: boolean }) {
  const navigate = useNavigate({from: Route.fullPath});

  return (
    <Flex
      direction="column"
      gap={4}
      justifyContent="center"
      alignItems="center"
      position={"relative"}
    >
      {isMe && (
        <Button
          onClick={async () => {
            await navigate({
              to: "/profile/edit-info",
              search: {
                fromProfile: true,
              },
            });
          }}
          position={"absolute"}
          top={5}
          right={5}
        >
          <EditIcon/>
        </Button>
      )}
      <Flex
        w="100%"
        px={4}
        gap={4}
        alignItems="center"
        justifyContent="center"
        wrap="wrap"
      >
        {data.images[0] ? (
          <UserImage
            imageName={data.images[0]}
            width="300px"
            height="300px"
            borderRadius={"full"}
          />
        ) : (
          <DefaultAvatar/>
        )}
        <Flex direction={"column"} alignItems="center" gap={4} maxW={"100%"}>
          <Flex direction="column" gap={2} maxW={"100%"}>
            <p>{data.firstName + " " + data.lastName}</p>
            <p>{data.address}</p>
            <p>Fame: {data.fameRating}</p>
            <Flex gap={2} wrap="wrap">
              {Object.entries(data.tags).map(([key, value]) => {
                return (
                  <Badge key={value} size="lg" variant="solid">
                    {key}
                  </Badge>
                );
              })}
            </Flex>
          </Flex>
          <Flex
            direction={"column"}
            gap={1}
            w="100%"
            h={150}
            p={4}
            borderWidth="1px"
            borderRadius={8}
            borderColor="gray.200"
          >
            <Text color={"gray.500"} fontSize={"sm"}>
              Biography
            </Text>
            <Text>{data.biography}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        wrap="wrap"
        gap={4}
        justifyContent="center"
        alignItems="center"
        w={"100%"}
        p={4}
        position={"relative"}
      >
        {isMe && (
          <Button
            onClick={async () => {
              await navigate({
                to: "/profile/edit-images",
                search: {
                  fromProfile: true,
                },
              });
            }}
            position={"absolute"}
            top={5}
            right={5}
          >
            <EditImages/>
          </Button>
        )}
        {data.images.map((_image, index) => {
          if (index + 1 > 1)
            return <UserImage key={index} imageName={_image}/>;
        })}
      </Flex>
    </Flex>
  );
}
