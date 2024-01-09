const express = require("express");
const { MakeBooking } = require("../Controllers/Booking.controller");
const { verifyToken } = require("../Controllers/Middleware");

const router = express.Router();

router.post("/ride/booking", verifyToken, MakeBooking);

module.exports = router;
