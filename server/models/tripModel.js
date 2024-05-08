import mongoose, { Schema } from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    tripName: { type: String, required: true },
    city: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    image: { type: String },
    plans: [{ type: Schema.Types.ObjectId, ref: "Plans", required: false }],
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    status: { type: Boolean, required: true, default: true },
    total: { type: String, required: true },
  },
  { timestamps: true }
);

const Trips = mongoose.model("Trips", tripSchema);

export default Trips;
