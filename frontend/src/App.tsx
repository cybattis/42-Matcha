import './App.css'
import axios from "axios";
import {useState} from "react";

function App() {
    axios.defaults.baseURL = 'http://localhost:5163';
    const [image, setImage] = useState<string>("");
    
    function getData() { 
        axios.get('/UserProfile/Get/1')
            .then(function (response) {
                console.log(response.data);
                console.log(response.status);
                console.log(response.statusText);
                console.log(response.headers);
                console.log(response.config);
                setImage('data:image/jpeg;base64,' + response.data.images_data[0]);
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
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    }

  return (
    <>
        <button onClick={getData}>TEST</button>
        <img src={image}/>
    </>
  )
}

export default App
