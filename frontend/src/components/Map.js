import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const Map = ({ coordinates }) => (
  <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={13} style={{ height: '300px', width: '100%' }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[coordinates.lat, coordinates.lng]} />
  </MapContainer>
);

export default Map;
