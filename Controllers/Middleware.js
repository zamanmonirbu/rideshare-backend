const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
require("dotenv").config();
const secretKey = process.env.SECRETE_KEY;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "Access denied. Token is missing." });
    }

    const decoded = await jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Access denied. Token has expired." });
    }
    return res.status(401).json({ error: "Access denied. Invalid token." });
  }
};


module.exports={verifyToken};