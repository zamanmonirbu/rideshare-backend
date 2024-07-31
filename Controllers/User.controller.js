const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models/User.model");
dotenv.config();

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
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const UserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "5h" });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const UserBookings = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("booking");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve user bookings", message: error.message });
  }
};

module.exports = { UserRegister, UserLogin, UserBookings };
