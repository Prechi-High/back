import { useState, useEffect } from "react";
import axios from "axios";

const AdminTrackingDashboard = () => {
  const [trackings, setTrackings] = useState([]);
  const [editingTracking, setEditingTracking] = useState(null);
  const [formData, setFormData] = useState({
    current: "", //current location name
    currentLatitude: "",
    currentLongitude: "",
    destinationLatitude: "",
    destinationLongitude: "",
  });

  // Fetch all trackings
  useEffect(() => {
    axios.get("http://localhost:5000/track/api/admin/trackings")
      .then((response) => setTrackings(response.data))
      .catch((error) => console.error("Error fetching trackings:", error));
  }, []);

  // Handle Edit Button Click
  const handleEdit = (tracking) => {
    setEditingTracking(tracking.trackingNumber);
    setFormData({
        current: tracking.current,
      currentLatitude: tracking.currentLatitude,
      currentLongitude: tracking.currentLongitude,
      destinationLatitude: tracking.destinationLatitude,
      destinationLongitude: tracking.destinationLongitude,
    });
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Save Button Click
  const handleSave = async () => {
    await axios.put(`http://localhost:5000/track/api/admin/tracking/${editingTracking}`, formData);
    alert("Tracking updated!");
    setEditingTracking(null);
    window.location.reload(); // Refresh after update
  };

  return (
    <div>
      <h3> Product Tracking </h3>
      <table border="1">
        <thead>
          <tr>
            <th>Courier</th>
            <th>Tracking Number</th>
            <th>Current Location coordinate</th>
            <th>Current Location Name</th>
            <th>Destination coordinate</th>
            <th>Distance Remaining</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trackings.map((tracking) => (
            <tr key={tracking.trackingNumber && tracking.courier}>
              <td>{tracking.courier}</td>
              <td>{tracking.trackingNumber}</td>
              <td>{tracking.currentLatitude}, {tracking.currentLongitude}</td>
              <td>{tracking.current}</td>
              <td>{tracking.destinationLatitude}, {tracking.destinationLongitude}</td>
              <td>{tracking.distanceRemaining}</td>
              <td>
                {editingTracking === tracking.trackingNumber ? (
                  <>
                   <input name="current" value={formData.current} onChange={handleChange}  placeholder="Current location name"/>
                    <input name="currentLatitude" value={formData.currentLatitude} onChange={handleChange}  placeholder="Current latitute"/>
                    <input name="currentLongitude" value={formData.currentLongitude} onChange={handleChange}  placeholder="Current longitude"/>
                    <input name="destinationLatitude" value={formData.destinationLatitude} onChange={handleChange}  placeholder="Destination latitute"/>
                    <input name="destinationLongitude" value={formData.destinationLongitude} onChange={handleChange}  placeholder="Destination longitude"/>
                    <button onClick={handleSave}>Save</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(tracking)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AdminTrackingDashboard;