import axios from "axios";

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function GetAddress(lat: number | undefined, lon: number | undefined) {
  if (!lat || !lon) {
    return;
  }

  const reverseGeocoding = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`
  );
  const {house_number, city, postcode, road, suburb, town, village} =
    reverseGeocoding.data.address;
  const displayLocation = `${house_number ? `${house_number},` : ""} ${road}, ${suburb ? `${suburb},` : ""}${postcode}, ${city || town || village}`;

  console.log(displayLocation);
  return displayLocation;
}

export async function GetAddressFromString(coordinates: string) {
  if (!coordinates) {
    return;
  }

  const [lat, lon] = coordinates.split(",");

  const reverseGeocoding = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`
  );
  const {house_number, city, postcode, road, suburb, town, village} =
    reverseGeocoding.data.address;
  const displayLocation = `${house_number ? `${house_number},` : ""} ${road}, ${suburb ? `${suburb},` : ""}${postcode}, ${city || town || village}`;

  console.log("DISPLAY LOCATION", displayLocation);
  return displayLocation;
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