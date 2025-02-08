import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix marker icon issue for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
});

// Custom Icons
const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2596/2596007.png", // Navy blue truck icon
  iconSize: [45, 45], 
  iconAnchor: [22, 45], 
  popupAnchor: [0, -40], 
});

const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Red destination pin icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function Track() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/track/api/tracking/${trackingNumber}`
      );

      if (response.status !== 200) {
        throw new Error("Tracking information not found.");
      }

      setTrackingData(response.data);
      setError("");
    } catch (err) {
      setTrackingData(null);
      setError(err.response?.data?.message || "Error retrieving tracking info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Track Your Package</h1>
      <input
        type="text"
        placeholder="Enter Tracking Number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <button onClick={handleTrack} disabled={loading}>
        {loading ? "Tracking..." : "Track"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {trackingData && (
        <div>
          <h2>Tracking Number: {trackingData.trackingNumber}</h2>
          <p>Starting Point: {trackingData.from}</p>
          <p>Destination: {trackingData.destination}</p>
          <p>Current Location: {trackingData.current}</p>
          <p>Distance Remaining: {trackingData.distanceRemaining}</p>

          <h2>Live Map</h2>
          <MapContainer
            center={[trackingData.latitude, trackingData.longitude]}
            zoom={4}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Start Location Marker */}
            <Marker position={[trackingData.latitude, trackingData.longitude]}>
              <Popup>
                <strong>Start location</strong><br />
                Name: {trackingData.from}<br />
                Latitude: {trackingData.latitude}<br />
                Longitude: {trackingData.longitude}
              </Popup>
            </Marker>

            {/* Current Location Marker (Navy Blue Truck) */}
            <Marker
              position={[trackingData.currentLatitude, trackingData.currentLongitude]}
              icon={truckIcon}
            >
              <Popup>
                <strong>Current Location</strong><br />
                Name: {trackingData.current}<br />
                Latitude: {trackingData.currentLatitude}<br />
                Longitude: {trackingData.currentLongitude}
              </Popup>
            </Marker>

            {/* Destination Location Marker (Red Pin) */}
            <Marker
              position={[trackingData.destinationLatitude, trackingData.destinationLongitude]}
              icon={destinationIcon}
            >
              <Popup>
                <strong>Destination</strong><br />
                Name: {trackingData.destination}<br />
                Latitude: {trackingData.destinationLatitude}<br />
                Longitude: {trackingData.destinationLongitude}
              </Popup>
            </Marker>

            {/* Route Line (Polyline) */}
            <Polyline
              positions={[
                [trackingData.latitude, trackingData.longitude],  // Start
                [trackingData.currentLatitude, trackingData.currentLongitude], // Current
                [trackingData.destinationLatitude, trackingData.destinationLongitude], // Destination
              ]}
              color="blue"
              weight={4}
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
