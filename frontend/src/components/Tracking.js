import React, { useState } from 'react';
import axios from 'axios';
import Map from './Map';

const TrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleTrack = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/track/${trackingNumber}`);
      setTrackingInfo(res.data);
    } catch (err) {
      alert('Tracking number not found');
    }
  };

  return (
    <div>
      <h2>Track Your Parcel</h2>
      <input type="text" placeholder="Enter Tracking Number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
      <button onClick={handleTrack}>Track</button>
      {trackingInfo && <Map coordinates={trackingInfo.coordinates} />}
    </div>
  );
};

export default TrackingPage;
