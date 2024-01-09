const { verifyToken } = require("../Controllers/Middleware");

const {
  RiderRegister,
  RiderLogin,
  RiderByVehicleType,
  RidersCompletedRides,
} = require("../Controllers/Rider.controller");
const express = require("express");
const router = express.Router();

router.post("/rider/register", RiderRegister);
router.post("/rider/login", RiderLogin);
router.get("/riders/:vehicleType", RiderByVehicleType);
router.get("/rider", verifyToken, RidersCompletedRides);

module.exports = router;
