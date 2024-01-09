const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models/User.model");
require("dotenv").config();
const secretKey = process.env.SECRETE_KEY;


const UserRegister = async (req, res) => {
  const { username, email, password, time, gender } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      time,
      gender,
    });
    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

const UserLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "5h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

const UserBookings = (req, res) => {
  User.find({ _id: req.userId })
    .populate("booking")
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(400).json({ error: "Unable to retrieve users " });
    });
};

module.exports = {UserRegister, UserLogin, UserBookings};
