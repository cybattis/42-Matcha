import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/profile/edit-images")({
  component: RouteComponent,
});

import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { Box } from "@chakra-ui/react";
import { ToasterError, ToasterSuccess } from "@/lib/toaster.ts";
import axios, { AxiosError } from "axios";

function UploadImage() {
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
        await UploadToServer(file.files[0]);
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
      />
    </FileUploadRoot>
  );
}

// type FileUpload = {
//   position: string;
//   files: File;
// };

async function UploadToServer(file: File) {
  const formData = new FormData();

  formData.append("Position", "1");
  formData.append("Data", file);

  const token = localStorage.getItem("token");

  axios
    .post("/UserPicture/Upload", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + token,
      },
    })
    .then((result) => {
      console.log(result);
      ToasterSuccess(result.data);
    })
    .catch((error: AxiosError<string>) => {
      if (error.response) ToasterError(error.response.data);
      else ToasterError("An error occured");
    });
}

function RouteComponent() {
  return (
    <Box>
      <UploadImage />
    </Box>
  );
}
