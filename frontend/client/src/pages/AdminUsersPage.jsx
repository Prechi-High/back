import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [trackingData, setTrackingData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchTrackings();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:5000/track/admin/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const fetchTrackings = () => {
    axios.get("http://localhost:5000/track/admin/trackings")
      .then((response) => setTrackingData(response.data))
      .catch((error) => console.error("Error fetching tracking data:", error));
  };

  // ✅ Delete a user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This will remove all their data.")) {
      try {
        await axios.delete(`http://localhost:5000/track/admin/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        setTrackingData(trackingData.filter(track => track.user !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // ✅ Delete a tracking record
  const handleDeleteTracking = async (trackingId) => {
    if (window.confirm("Are you sure you want to delete this tracking record?")) {
      try {
        await axios.delete(`http://localhost:5000/track/admin/trackings/${trackingId}`);
        setTrackingData(trackingData.filter(track => track._id !== trackingId));
      } catch (error) {
        console.error("Error deleting tracking record:", error);
      }
    }
  };

  return (
    <div>
      <h1>Admin - User Management</h1>
      <button onClick={() => navigate("/admin")}>Back to Dashboard</button>

      {/* User Information Table */}
      <h2>User Information</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleDeleteUser(user._id)} style={{ color: "red" }}>
                  Delete User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tracking Information Table */}
      <h2>Tracking Information</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>Courier</th>
            <th>Tracking Number</th>
            <th>Current Location</th>
            <th>Destination</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trackingData.length > 0 ? (
            trackingData.map((track) => (
              <tr key={track._id}>
                <td>{track.username}</td>
                <td>{track.courier || "N/A"}</td>
                <td>{track.trackingNumber || "N/A"}</td>
                <td>{track.current || "N/A"}</td>
                <td>{track.destination || "N/A"}</td>
                <td>
                  <button onClick={() => handleDeleteTracking(track._id)} style={{ color: "red" }}>
                    Delete Tracking
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No tracking data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
