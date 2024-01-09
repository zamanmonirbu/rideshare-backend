const mongoose=require('mongoose')
const riderSchema = new mongoose.Schema({
  username: String,
  gender: String,
  email: String,
  password: String,
  time: {
    type: Date,
    default: Date.now,
  },
  vehicle: String,
  booking: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

const Rider = mongoose.model('Rider', riderSchema);
module.exports={Rider};