import React, { useEffect, useState } from "react";
import axios from "axios";

const UserData: React.FC = () => {
  const [image, setImage] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await axios
        .get("/UserProfile/Get/1")
        .then(function (response) {
          console.log(response.data);
          console.log(response.status);
          console.log(response.statusText);
          console.log(response.headers);
          console.log(response.config);
          setImage("data:image/jpeg;base64," + response.data.images_data[0]);
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  };

  return (
    <div className="flex flex-row">
      <button onClick={fetchData}>IMAGE</button>
      <button onClick={() => setImage("")}>CLEAR</button>
      <img src={image} />
    </div>
  );
};

export default UserData;
