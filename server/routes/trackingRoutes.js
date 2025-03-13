import express from "express";
import Tracking from "../models/Tracking.js";
import haversine from "haversine-distance";
import User from "../models/User.js"; // Import User model

const router = express.Router();
/**
 * DELETE a user and their tracking records (Admin Only)
 */
router.delete("/admin/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Remove user's tracking records first
    await Tracking.deleteMany({ user: userId });

    // Remove the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User and their tracking records deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * DELETE a tracking record (Admin Only)
 */
router.delete("/admin/trackings/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;

    // Delete tracking record
    const tracking = await Tracking.findByIdAndDelete(trackingId);
    if (!tracking) {
      return res.status(404).json({ message: "Tracking record not found." });
    }

    // Remove tracking reference from user
    await User.updateMany({}, { $pull: { tracking: trackingId } });

    res.json({ message: "Tracking record deleted successfully." });
  } catch (error) {
    console.error("Error deleting tracking record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//✅ GET all users (Admin Route)

router.get("/admin/users", async (req, res) => {
 try {
   const users = await User.find({}, "username email");
   res.json(users);
 } catch (error) {
   console.error("Error fetching users:", error);
   res.status(500).json({ message: "Internal Server Error" });
 }
});

/**
* ✅ GET all tracking records (Admin Route)
*/
router.get("/admin/trackings", async (req, res) => {
 try {
   const trackings = await Tracking.find({}, "trackingNumber courier current destination");
   res.json(trackings);
 } catch (error) {
   console.error("Error fetching tracking records:", error);
   res.status(500).json({ message: "Error fetching tracking records." });
 }
});
/**
 * GET tracking information by tracking number
 */
router.get("/track/:trackingNumber", async (req, res) => {
  try {
    const tracking = await Tracking.findOne({ trackingNumber: req.params.trackingNumber });

    if (!tracking) {
      return res.status(404).json({ message: "Tracking number not found" });
    }

    res.json(tracking);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * GET all tracking records (Admin Route)
 */
router.get("/api/admin/trackings", async (req, res) => {
  try {
    const trackings = await Tracking.find();
    res.json(trackings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tracking records." });
  }
});

/**
 * Calculate distance using Haversine formula
 */
const calculateDistance = (currentLat, currentLng, destLat, destLng) => {
  const current = { latitude: parseFloat(currentLat), longitude: parseFloat(currentLng) };
  const destination = { latitude: parseFloat(destLat), longitude: parseFloat(destLng) };

  const distanceInMeters = haversine(current, destination);
  return (distanceInMeters / 1609.34).toFixed(2); // Convert meters to miles
};

/**
 * UPDATE tracking info (For Users)
 */
router.put("/api/tracking/update/:trackingNumber", async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { newCurrent, newLatitude, newLongitude } = req.body;

    const tracking = await Tracking.findOne({ trackingNumber });

    if (!tracking) {
      return res.status(404).json({ message: "Tracking number not found." });
    }

      // // Recalculate distance
      // tracking.distanceRemaining = calculateDistance(
      //   currentLatitude,
      //   currentLongitude,
      //   destinationLatitude,
      //   destinationLongitude
      // ) + " miles away";
    // Calculate remaining distance
    const distanceRemaining = calculateDistance(
      newLatitude,
      newLongitude,
      tracking.destinationLatitude,
      tracking.destinationLongitude
    );

    // Update tracking info
    tracking.current = newCurrent;
    tracking.currentLatitude = newLatitude;
    tracking.currentLongitude = newLongitude;
    tracking.distanceRemaining = `${distanceRemaining} miles away`;

    await tracking.save();
    res.json({ message: "Tracking updated successfully!", tracking });
  } catch (error) {
    res.status(500).json({ message: "Error updating tracking info." });
  }
});

/**
 * UPDATE tracking info (Admin Only)
 */
router.put("/api/admin/tracking/:trackingNumber", async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { current, currentLatitude, currentLongitude, destinationLatitude, destinationLongitude } = req.body;

    const tracking = await Tracking.findOne({ trackingNumber });

    if (!tracking) {
      return res.status(404).json({ message: "Tracking not found." });
    }


     // Recalculate distance
     const distanceRemaining = calculateDistance(
      currentLatitude,
      currentLongitude,
      destinationLatitude,
      destinationLongitude
    ) + " miles away";


    // Update tracking record
    tracking.current = current;
    tracking.currentLatitude = currentLatitude;
    tracking.currentLongitude = currentLongitude;
    tracking.destinationLatitude = destinationLatitude;
    tracking.destinationLongitude = destinationLongitude;
    tracking.distanceRemaining = distanceRemaining;
   
    await tracking.save();
    res.json({ message: "Tracking updated successfully!", tracking });
  } catch (error) {
    res.status(500).json({ message: "Error updating tracking info." });
  }
});

/**
 * CREATE tracking info (Admin Only)
 */
router.post("/api/tracking", async (req, res) => {
  try {
    const { trackingNumber, courier, from, current, destination, longitude,latitude , currentLatitude,
      currentLongitude,
      destinationLatitude,
      destinationLongitude} = req.body;
  // Calculate initial distance
  const distanceRemaining = calculateDistance(
    currentLatitude,
    currentLongitude,
    destinationLatitude,
    destinationLongitude
  ) + " miles away";
  
    const tracking = new Tracking({
      trackingNumber,
      courier,
      from,
      current,
      destination,
      latitude,
      longitude,
      currentLatitude,
      currentLongitude,
      destinationLatitude,
      destinationLongitude,
      distanceRemaining,
    });

   

    await tracking.save();

    res.status(201).json({ message: "Tracking info added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving tracking info." });
  }
});

/**
 * GET tracking info (For Users)
 */
router.get("/api/tracking/:trackingNumber", async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const trackingData = await Tracking.findOne({ trackingNumber });

    if (!trackingData) {
      return res.status(404).json({ message: "Tracking information not found" });
    }

    res.json(trackingData);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
