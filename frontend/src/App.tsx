import "./App.css";
import axios from "axios";
import useGeoLocation from "./Components/Geolocalization";

const url = (axios.defaults.baseURL = "http://localhost:5163");

function App() {
  var geoData = useGeoLocation();

  return (
    <div className="flex flex-col">
      <h2>Location</h2>
      <p>Latitude: {geoData.lat}</p>
      <p>Longitude: {geoData.lon}</p>
    </div>
  );
}

export default App;
