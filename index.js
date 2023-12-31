const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
const url = process.env.URL;
const port = process.env.PORT || 3000;
const cors = require('cors')
app.use(cors())
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const secretKey = process.env.SECRETE_KEY;



// Create a user schema
const userSchema = new mongoose.Schema({
  username:String,
  gender:String,
  email: String,
  password: String,
  time: {
    type: Date,
    default: Date.now,
  },
  booking: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  ],
});

// Create a rider schema
const riderSchema = new mongoose.Schema({
  username:String,
  gender:String,
  email: String,
  password: String,
  time: {
    type: Date,
    default: Date.now,
  },
  vehicle:String,
  booking: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  ],
});

// Create a booking schema
const bookingSchema = new mongoose.Schema({
  from: String,
  to: String,
  rider:String,
  time: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },


});



//models
const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Rider = mongoose.model('Rider', riderSchema);





//Register user
app.post('/user/register', async (req, res) => {
  const { username, email, password,time, gender } = req.body;


  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
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
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

//Login User
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });


  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }


  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

//Register rider
app.post('/rider/register', async (req, res) => {
  const { username, email, password, gender,time,vehicle } = req.body;


  try {
    const existingRider = await Rider.findOne({ email });
    if (existingRider) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Rider({
      username,
      email,
      password: hashedPassword,
      gender,
      time,
      vehicle
    });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

//Login rider
app.post('/rider/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Rider.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });
    res.json({token:token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

//Middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Access denied. Invalid token.' });
    }
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  });
};

//make bookings
app.post('/ride/booking', verifyToken, async (req, res) => {
  const { from, to,rider,time } = req.body;
  const newBooking = new Booking({
    from,
    to,
    time,
    rider,
    user: req.userId,
  });
  try {
    const booking = await newBooking.save();
    await User.updateOne(
      { _id: req.userId },
      {
        $push: {
          booking: booking._id,
        },
      }
    );
    await Rider.updateOne(
      { _id: rider },
      {
        $push: {
          booking: booking._id,
        },
      }
    );
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create and update ' });
  }
});

//Get rider on vehicleType
app.get('/riders/:vehicleType', async (req, res) => {
  try {
    const { vehicleType } = req.params;

    const riders = await Rider.find({ vehicle: vehicleType }, '_id, username');

    res.json(riders);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get a person booking info
app.get('/my/bookings', verifyToken, (req, res) => {
  User.find({ _id: req.userId })
      .populate('booking')
      .then((users) => {
          res.status(200).json(users);
      })
      .catch((err) => {
          res.status(400).json({ error: 'Unable to retrieve users and their todo' });
      });
});

//Get complete ride share of a rider
app.get('/rider', verifyToken, (req, res) => {
  Rider.find({ _id: req.userId })
      .populate('booking')
      .then((users) => {
          res.status(200).json(users);
      })
      .catch((err) => {
          res.status(400).json({ error: 'Unable to retrieve users and their todo' });
      });
});



// Run the app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



