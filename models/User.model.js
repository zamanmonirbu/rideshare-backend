// Create a user schema
const mongoose=require('mongoose')
const userSchema = new mongoose.Schema({
  username: String,
  gender: String,
  email: String,
  password: String,
  time: {
    type: Date,
    default: Date.now,
  },
  booking: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});


const User = mongoose.model("User", userSchema);
module.exports={User};