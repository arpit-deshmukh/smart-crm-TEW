const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
  type: String,
  enum: ["admin", "user"],
  default: "user",
},

resetPasswordToken: {
  type: String,
  default: "",
},

resetPasswordExpires: {
  type: Date,
  default: null,
},

phone: {
      type: String,
      default: "",
      trim: true,
    },

     profileImage: {
      type: String,
      default: "https://i.pravatar.cc/150?img=12",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },


    isActive: {
      type: Boolean,
      default: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "accepted", "denied"],
      default: "pending",
    },

    approvalMessage: {
      type: String,
      default: "",
      trim: true,
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);