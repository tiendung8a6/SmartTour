import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    accountType: { type: String, default: "User" },
    image: { type: String },
    password: { type: String, select: true },
    provider: { type: String, default: "Email" },
    followers: [{ type: Schema.Types.ObjectId, ref: "Followers" }],
    isLock: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    //Thêm mới
    points: { type: Number, default: 0 },
    viewedTrips: [
      { type: Schema.Types.ObjectId, ref: "Trips", default: false },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
