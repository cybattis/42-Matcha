import {useEffect, useState} from "react";
import {AspectRatio, Box, Image} from "@chakra-ui/react";
import {DownloadImage} from "@/routes/_app/profile.edit-images.tsx";

export function UserImage({
                            userID,
                            position,
                            width,
                            height,
                            borderRadius,
                          }: {
  userID?: number;
  position: number;
  width?: string;
  height?: string;
  borderRadius?: string;
}) {
  const [image, setImage] = useState<string>("");
  if (!userID) {
    userID = parseInt(localStorage.getItem("id") || "");
  }

  useEffect(() => {
    DownloadImage(userID, position).then((data) => {
      setImage(data);
    });
  }, []);

  return (
    <>
      {image ?
        <Box w={width ?? "500px"} h={height ?? "500px"}>
          <Image
            rounded={borderRadius ?? "md"}
            src={image}
            alt="Image"
            width={"100%"}
            height={"100%"}
            fit={"cover"}
          />
        </Box>
        : null}
    </>
  );
}

export function DownloadImageUrl({
                                   userID,
                                   url,
                                   width,
                                   height,
                                   borderRadius,
                                 }: {
  userID?: number;
  position: number;
  width?: string;
  height?: string;
  borderRadius?: string;
}) {
  const [image, setImage] = useState<string>("");
  if (!userID) {
    userID = parseInt(localStorage.getItem("id") || "");
  }

  useEffect(() => {
    DownloadImageUrl(url).then((data) => {
      setImage(data);
    });
  }, []);

  return (
    <>
      {image ?
        <Box w={width ?? "500px"} h={height ?? "500px"}>
          <Image
            rounded={borderRadius ?? "md"}
            src={image}
            alt="Image"
            width={"100%"}
            height={"100%"}
            fit={"cover"}
          />
        </Box>
        : null}
    </>
  );
}