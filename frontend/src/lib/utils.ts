import axios from "axios";

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function DownloadImageUrl(url: string) {
  const token = localStorage.getItem("token");

  return axios
  .get("/UserPicture/Get/" + url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
  .then((response) => {
    return response.data;
  }).catch(() => {

  });
}
