const { Booking } = require("../models/Booking.model");
const { Rider } = require("../models/Rider.model");
const { User } = require("../models/User.model");

const MakeBooking = async (req, res) => {
  const { from, to, rider, time } = req.body;
  const newBooking = new Booking({
    from,
    to,
    time,
    rider,
    user: req.userId,
  });

  try {
    const booking = await newBooking.save();

    // Update User and Rider
    await User.updateOne(
      { _id: req.userId },
      { $push: { booking: booking._id } }
    );

    await Rider.updateOne({ _id: rider }, { $push: { booking: booking._id } });

    res.status(201).json(booking);
  } catch (error) {
    // Rollback booking creation if the update fails
    await Booking.deleteOne({ _id: newBooking._id });

    res.status(400).json({ error: "Unable to create and update" });
  }
};

module.exports = {MakeBooking};
