const userRoutes = require("./Routes/UserRoutes");
const riderRouters = require("./Routes/RiderRoutes");
const bookingRouters = require("./Routes/BookingRoutes");
const comments=require('./Routes/commentRoutes');

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const url=process.env.URL;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.use(userRoutes);
app.use(bookingRouters);
app.use(riderRouters);
app.use("/comment",comments);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
