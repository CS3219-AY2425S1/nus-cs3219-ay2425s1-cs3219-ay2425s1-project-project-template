const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
        //add email validation logic can be added here
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); 

module.exports = mongoose.model("User", userSchema);
