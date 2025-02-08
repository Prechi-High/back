import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminTrackingDashboard from "./AdminTrackingDashboard";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTrackerForm, setShowTrackerForm] = useState(false);
  const navigate = useNavigate();

  // State for tracking input
  const [trackingNumber, setTrackingNumber] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [courier, setCourier] = useState("");
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    if (!adminStatus) navigate("/login");
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trackingData = {
      trackingNumber,
      latitude,
      longitude,
      courier, 
      from, 
      current, 
      destination
    };

    try {
      const response = await fetch("http://localhost:5000/track/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("Tracking information added successfully!");
      setTrackingNumber("");
      setLatitude("");
      setLongitude("");
      setCourier("");
      setFrom("");
      setDestination("");
      setCurrent("");
      setShowTrackerForm(false); // Hide form after submission
    } catch (error) {
      setMessage(error.message || "Failed to add tracking info.");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {isAdmin ? (
        <div>
          <p>Welcome, Admin!</p>

          {/* Buttons Row - "View Users" and "Create Tracker" */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button onClick={() => navigate("/admin/users")}>View Users</button>
            <button onClick={() => setShowTrackerForm(!showTrackerForm)}>
              {showTrackerForm ? "Hide Tracker Form" : "Create Tracker"}
            </button>
          </div>

          {/* Tracking Form - Only shown when "Create Tracker" is clicked */}
          {showTrackerForm && (
            <div>
              <h2>Add Tracking Information</h2>
              <form onSubmit={handleSubmit}>
                <label>Courier Name:</label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  required
                />
                <label>Tracking Number:</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                />

                <label>Latitude:</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                />

                <label>Longitude:</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                />
                <label>Start location:</label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />

                <label>Destination:</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />

                <label>Current location:</label>
                <input
                  type="text"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  required
                />

                <button type="submit">Add Tracking Info</button>
              </form>

              {message && <p>{message}</p>}
            </div>
          )}

          {/* Tracking Dashboard */}
          <div>
            <AdminTrackingDashboard />
          </div>
        </div>
      ) : (
        <p>Unauthorized access</p>
      )}
    </div>
  );
}
