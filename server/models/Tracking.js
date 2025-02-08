import mongoose from "mongoose";

const TrackingSchema = new mongoose.Schema({
  trackingNumber: String,
  courier: String,
  from: String,
  current: String,
  destination: String,
  latitude: String,
  longitude: String,
  locationName: String,
  currentLatitude: String,
  currentLongitude: String,
  destinationLatitude: String,
  destinationLongitude: String,
  distanceRemaining: String, // Store remaining distance
  coordinates: { lat: Number, lng: Number },

});


export default mongoose.model("Tracking", TrackingSchema);
