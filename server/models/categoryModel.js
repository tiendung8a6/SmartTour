import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    color: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Categories = mongoose.model("Categories", categorySchema);

export default Categories;
