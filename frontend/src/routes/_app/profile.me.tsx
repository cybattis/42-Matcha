import {createFileRoute, useNavigate} from "@tanstack/react-router";
import axios from "axios";
import {UserProfile} from "@/lib/interface.ts";
import {MyRooterContext} from "@/routes/__root.tsx";
import {useEffect, useState} from "react";
import {GetAddressFromString} from "@/lib/utils.ts";
import {Badge, Box, Button, Flex, Text} from "@chakra-ui/react";
import {UserImage} from "@/components/UserImage.tsx";
import {EditIcon, EditImages} from "@/components/Icons.tsx";

export const Route = createFileRoute("/_app/profile/me")({
  component: RouteComponent,
  loader: async ({context}: { context: MyRooterContext }) =>
    await GetProfile(context.auth.token),
});

export async function GetProfile(token: string | null) {
  const response = await axios.get("/UserProfile/Me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data as UserProfile;
}

function RouteComponent() {
  const data = Route.useLoaderData() as UserProfile;
  const [address, setAddress] = useState<string>("");
  const id = parseInt(localStorage.getItem("id") || "");
  const navigate = useNavigate({from: Route.fullPath});

  console.log(data);
  useEffect(() => {
    GetAddressFromString(data.coordinates).then((res) => {
      console.log(res);
      setAddress(res);
    });
  }, [data]);

  return (
    <>
      <Flex direction="column" gap={4} justifyContent="center" alignItems="center" position={"relative"}>
        <Button
          onClick={async () => {
            await navigate({
              to: "/profile/edit-info",
              search: {
                fromProfile: true,
              }
            });
          }}
          position={"absolute"} top={5} right={5}>
          <EditIcon/>
        </Button>
        <Flex w="100%" gap={4} alignItems="center" justifyContent="center" wrap="wrap">
          <UserImage position={1} userID={id} width="300px" height="300px" borderRadius={"full"}/>
          <Flex direction={"column"} alignItems="center" gap={4} maxW={"100%"}>
            <Flex direction="column" gap={2} maxW={"100%"}>
              <p>{data.firstName + " " + data.lastName}</p>
              <p>{address}</p>
              <p>Fame: {data.fameRating}</p>
              <Flex gap={2} wrap="wrap">
                {Object.entries(data.tags).map(([key, value]) => {
                  return <Badge key={value} size="lg" variant="solid">{key}</Badge>;
                })}
              </Flex>
            </Flex>
            <Flex direction={"column"} gap={1} w="100%" h={150} maxW={"100%"} p={4} borderWidth="1px" borderRadius={8}
                  borderColor="gray.200">
              <Text color={"gray.500"} fontSize={'sm'}>Biography</Text>
              <Text>{data.biography}</Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex wrap="wrap" gap={4} justifyContent="center" alignItems="center" w={'100%'} p={4} position={"relative"}>
          <Button onClick={async () => {
            await navigate({to: "/profile/edit-images"});
          }} position={"absolute"} top={5} right={5}>
            <EditImages/>
          </Button>
          {data.images.map((image, index) => {
              if (index + 1 > 1)
                return <UserImage userID={id} position={index + 1}/>
            }
          )}
        </Flex>
      </Flex>
    </>
  )
}
