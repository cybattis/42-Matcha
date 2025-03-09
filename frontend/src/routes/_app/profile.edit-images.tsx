import { createFileRoute } from "@tanstack/react-router";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { Box, Image } from "@chakra-ui/react";
import { ToasterError, ToasterSuccess } from "@/lib/toaster.ts";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/profile/edit-images")({
  component: RouteComponent,
  loader: () => {},
});

function ImageComponent({
  userID,
  position,
}: {
  userID?: number;
  position: number;
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
    <FileUploadRoot
      maxW="xl"
      alignItems="stretch"
      maxFiles={1}
      accept={["image/png", "image/jpeg"]}
      maxFileSize={5000000}
      onFileAccept={async (file) => {
        if (!file.files[0]) {
          return;
        }
        console.log("file accepted", file);

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
    >
      <FileUploadDropzone
        label="Drag and drop here to upload"
        description=".png, .jpg up to 5MB"
      >
        {image ? <Image src={image} alt="Image" /> : null}
      </FileUploadDropzone>
    </FileUploadRoot>
  );
}

async function DownloadImage(userID: number, position: number) {
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

function RouteComponent() {
  // const [images, setImages] = useState<string[]>([]);

  return (
    <Box>
      <ImageComponent position={1} />
    </Box>
  );
}
