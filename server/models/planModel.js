import mongoose, { Schema } from "mongoose";

const planSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true },
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endDate: { type: Date, required: true },
    endTime: { type: String, required: true },
    address: { type: String, required: true },
    info: { type: String },
  },
  { timestamps: true }
);

const Plans = mongoose.model("Plans", planSchema);

export default Plans;
