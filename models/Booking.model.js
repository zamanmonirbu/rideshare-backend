// Create a booking schema
const mongoose=require('mongoose')
const bookingSchema = new mongoose.Schema({
  from: String,
  to: String,
  rider: String,
  time: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports={Booking};