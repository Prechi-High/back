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
    <div className="cover">
    <div className="homepage">
      <div className="content">
    <div>
      <h1>Admin Dashboard</h1>
      {isAdmin ? (
        <div>
          <p>Welcome, Admin!</p>

          {/* Buttons Row - "View Users" and "Create Tracker" */}
          <div className="auth-links2">
            <button onClick={() => navigate("/admin/users")} className="button">View Users</button>
            <button onClick={() => setShowTrackerForm(!showTrackerForm)} className="button2">
              {showTrackerForm ? "Hide Tracker Form" : "Create Tracker"}
            </button>
          </div>

          {/* Tracking Form - Only shown when "Create Tracker" is clicked */}
          {showTrackerForm && (
            <div>
              <h2>Add Tracking Information</h2>
              <form onSubmit={handleSubmit}>
                
                <input
                  type="text"
                  value={courier}
                  className="input"
                  onChange={(e) => setCourier(e.target.value)}
                  required
                /><label>Courier Name:</label><br/>
                
                 <input
                  type="text"
                  value={trackingNumber}
                    className="input"
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                /><label>Tracking Number:</label><br/>

               
                <input
                  type="text"
                  value={latitude}
                    className="input"
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                /> <label>Latitude:</label><br/>

               
                <input
                  type="text"
                  value={longitude}
                    className="input"
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                /> <label>Longitude:</label><br/>
               
                <input
                  type="text"
                  value={from}
                    className="input"
                  onChange={(e) => setFrom(e.target.value)}
                  required
                /> <label>Start location:</label><br/>

               
                <input
                  type="text"
                    className="input"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                /><label>Destination:</label><br/>

               
                <input
                  type="text"
                  value={current}
                    className="input"
                  onChange={(e) => setCurrent(e.target.value)}
                  required
                /><label>Current location:</label><br/>

                <button type="submit" className="button">Add Tracking Info</button>
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
    </div>
    </div>
    </div>
  );
}
