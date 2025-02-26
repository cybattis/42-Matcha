import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export function useCoordinate() {
  const [locationData, setLocationData] = useState<UserCoordinates>();

  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos: GeolocationPosition) {
    const crd: UserCoordinates = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
    setLocationData(pos.coords);
    console.log("Your current position is:");
    console.log(`Latitude : ${crd?.latitude}`);
    console.log(`Longitude: ${crd?.longitude}`);
  }

  async function errors(err: GeolocationPositionError) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    await getLocation();
  }

  async function getLocation() {
    // it will return the following attributes:
    // country, countryCode, regionName, city, lat, lon, zip and timezone
    const res = await axios.get("http://ip-api.com/json");
    console.log(res);
    if (res.status === 200) {
      const out: UserCoordinates = {
        latitude: res.data.lat,
        longitude: res.data.lon,
      };
      setLocationData(out);
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          console.log(result);
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            console.log("Location access denied.");
            // with ip address
            getLocation().then((r) => console.log(r));
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return {
    lat: locationData?.latitude,
    lon: locationData?.longitude,
  };
}
