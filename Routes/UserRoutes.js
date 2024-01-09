const { verifyToken } = require("../Controllers/Middleware");

const express = require("express");
const { UserBookings, UserLogin, UserRegister } = require("../Controllers/User.controller");
const router = express.Router();

router.post("/user/register", UserRegister);
router.post("/user/login", UserLogin);
router.get("/my/bookings",verifyToken, UserBookings);

module.exports = router;
