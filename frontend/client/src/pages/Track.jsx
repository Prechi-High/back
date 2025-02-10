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
    <div className="cover">
    <div className="homepage">
      <div className="content">
    <div>

    <div className="flex h-screen bg-[#1a4bff]">
      {/* Sidebar */}
      <div className="w-16 bg-white flex flex-col items-center py-6 gap-8">
        <div className="w-8 h-8 bg-[#1a4bff] rounded-lg flex items-center justify-center">
          <Package className="text-white" size={20} />
        </div>
        <nav className="flex flex-col gap-6">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Search size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <User size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings size={20} className="text-gray-600" />
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-3xl p-6 h-full flex gap-6">
          {/* Left Panel */}
          <div className="w-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold">Package tracking</h1>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Search size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-black text-white text-sm rounded-full">On the way</span>
                <span className="text-gray-500">Received</span>
              </div>

              {/* Tracking Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleTrack}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#1a4bff] text-white rounded-lg text-sm"
                >
                  {loading ? "..." : "Track"}
                </button>
              </div>

              {/* Shipment List */}
              <div className="space-y-4">
                <div className="p-4 border border-[#1a4bff] rounded-xl bg-blue-50">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-medium">Marseilles → New York</div>
                      <div className="text-sm text-gray-500">March 12 9:00 AM</div>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full">On Delivery</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=48&h=48&fit=crop"
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">Hassan Welch</div>
                        <div className="text-sm text-gray-500">Courier</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">123 Rue de la République, 13002 Marseille, France</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">456 5th Street, New York, NY 10001, USA</div>
                      </div>
                    </div>
                    <button className="w-full text-center text-sm text-blue-600">View details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            {trackingData ? (
              <MapContainer
                center={[trackingData.currentLatitude, trackingData.currentLongitude]}
                zoom={13}
                className="h-full rounded-2xl"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[trackingData.latitude, trackingData.longitude]}>
                  <Popup>{trackingData.from}</Popup>
                </Marker>
                <Marker
                  position={[trackingData.currentLatitude, trackingData.currentLongitude]}
                  icon={truckIcon}
                >
                  <Popup>{trackingData.current}</Popup>
                </Marker>
                <Marker
                  position={[trackingData.destinationLatitude, trackingData.destinationLongitude]}
                  icon={destinationIcon}
                >
                  <Popup>{trackingData.destination}</Popup>
                </Marker>
                <Polyline
                  positions={[
                    [trackingData.latitude, trackingData.longitude],
                    [trackingData.currentLatitude, trackingData.currentLongitude],
                    [trackingData.destinationLatitude, trackingData.destinationLongitude],
                  ]}
                  color="#1a4bff"
                  weight={3}
                />
              </MapContainer>
            ) : (
              <div className="h-full rounded-2xl bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Enter a tracking number to view the map</p>
              </div>
            )}

            {/* Order Details Overlay */}
            <div className="absolute bottom-4 right-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-sm">Order ID #14398-98567</div>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full">On Delivery</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=48&h=48&fit=crop"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-sm">Hassan Welch</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">From</div>
                  <div>Marseille, France</div>
                </div>
                <div>
                  <div className="text-gray-500">To</div>
                  <div>New York, USA</div>
                </div>
                <div>
                  <div className="text-gray-500">Current Location</div>
                  <div>Marseille, France</div>
                </div>
                <div>
                  <div className="text-gray-500">Miles Left</div>
                  <div>3,400 miles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
}
