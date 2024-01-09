const { Rider } = require("../models/Rider.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
require('dotenv').config()
const secretKey = process.env.SECRETE_KEY;


const RiderRegister = async (req, res) => {
  const { username, email, password, gender, time, vehicle } = req.body;

  try {
    const existingRider = await Rider.findOne({ email });
    if (existingRider) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Rider({
      username,
      email,
      password: hashedPassword,
      gender,
      time,
      vehicle,
    });
    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

const RiderLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await Rider.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "5h",
    });
    res.json({ token: token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

const RidersCompletedRides = (req, res) => {
  Rider.find({ _id: req.userId })
    .populate("booking")
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: "Unable to retrieve users and their todo" });
    });
};

const RiderByVehicleType = async (req, res) => {
  try {
    const { vehicleType } = req.params;

    const riders = await Rider.find({ vehicle: vehicleType }, "_id, username");

    res.json(riders);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {RiderRegister,RiderLogin,RidersCompletedRides,RiderByVehicleType};