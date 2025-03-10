import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import {AspectRatio, Flex, Grid, Image} from "@chakra-ui/react";
import {ToasterError, ToasterSuccess} from "@/lib/toaster.ts";
import axios, {AxiosError} from "axios";
import {useEffect, useState} from "react";
import {CloseButton} from "@/components/ui/close-button.tsx";
import {TrashIcon} from "@/components/Icons.tsx";
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute("/_app/profile/edit-images")({
  component: RouteComponent,
  loader: () => {
  },
});

function ImageComponent({
                          userID,
                          position,
                        }: {
  userID?: number;
  position: number;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
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
    <FileUploadRoot
      position={"relative"}
      maxW="500px"
      alignItems="stretch"
      maxFiles={1}
      accept={["image/png", "image/jpeg"]}
      maxFileSize={5000000}
      onFileAccept={async (file) => {
        if (!file.files[0]) {
          return;
        }
        console.log("file accepted", file);
        console.log("Position", position);

        // upload file
        const result = await UploadToServer(file.files[0], position);
        if (result) {
          await DownloadImage(userID, position).then((data) => {
            setImage(data);
          });
        }
      }}
      onFileReject={(files) => {
        if (!files.files[0]) {
          return;
        }

        files.files[0].errors.forEach((error) => {
          if (error === "FILE_INVALID_TYPE") {
            ToasterError("Invalid file type");
          } else if (error === "FILE_TOO_LARGE") {
            ToasterError("File is too large");
          } else {
            ToasterError(error);
          }
        });
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={onDelete}
    >
      <AspectRatio ratio={1}>
        <FileUploadDropzone
          padding={image ? 0 : 4}
          label="Drag and drop here to upload"
          description=".png, .jpg up to 5MB"
        >
          {image ? (
            <>
              {isHovering ? (
                <CloseButton
                  position={"absolute"}
                  variant="solid"
                  top={5}
                  right={5}
                  onMouseEnter={() => setOnDelete(true)}
                  onMouseLeave={() => setOnDelete(false)}
                  onClick={async () => {
                    await DeleteImage(position)
                    .then(() => {
                      setOnDelete(false);
                      setImage("");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  }}
                >
                  <TrashIcon/>
                </CloseButton>
              ) : null}
              <Image
                src={image}
                alt="Image"
                w={"100%"}
                h={"100%"}
                fit={"cover"}
              />
            </>
          ) : null}
        </FileUploadDropzone>
      </AspectRatio>
    </FileUploadRoot>
  );
}

export async function DownloadImage(userID: number, position: number) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("Position", position.toString());

  return axios
  .post("/UserPicture/Get/" + userID, formData, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
  .then((response) => {
    return response.data;
  }).catch(() => {

  });
}

async function DeleteImage(position: number) {
  const token = localStorage.getItem("token");

  return axios
  .delete("/UserPicture/Delete/" + position, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
  .then((response) => {
    ToasterSuccess(response.data);
  })
  .catch((err) => {
    ToasterError(err.detail);
  });
}

async function UploadToServer(file: File, position: number) {
  const formData = new FormData();

  formData.append("Position", position.toString());
  formData.append("Data", file);

  const token = localStorage.getItem("token");

  return await axios
  .post("/UserPicture/Upload", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + token,
    },
  })
  .then((result) => {
    console.log(result);
    ToasterSuccess(result.data);
    return true;
  })
  .catch((error: AxiosError<string>) => {
    if (error.response) ToasterError(error.response.data);
    else ToasterError("An error occured");
    return false;
  });
}

async function ValidateProfile() {
  const token = localStorage.getItem("token");
  console.log(token);

  return axios
  .get("/UserProfile/UpdateProfileStatus/", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
  .then((response) => {
    ToasterSuccess(response.data);
    return true;
  })
  .catch((err) => {
    ToasterError(err.detail);
    return false;
  });
}

function RouteComponent() {
  const navigate = useNavigate({from: Route.fullPath});


  return (
    <Grid gap="4" p="4">
      <Flex gap="4" wrap="wrap" justifyContent="center" alignItems="center">
        <ImageComponent position={1}/>
        <ImageComponent position={2}/>
        <ImageComponent position={3}/>
        <ImageComponent position={4}/>
        <ImageComponent position={5}/>
      </Flex>
      <Button
        justifySelf={"center"}
        maxW={75}
        onClick={async () => {
          const result = await ValidateProfile();
          if (result) {
            await navigate({
              to: "/home",
            });
          }
        }}
      >
        Save
      </Button>
    </Grid>
  );
}
