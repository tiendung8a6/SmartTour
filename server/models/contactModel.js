import mongoose, { Schema } from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    isReply: { type: Boolean, default: false },
    content: { type: String, required: false },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

const Contacts = mongoose.model("Contacts", contactSchema);

export default Contacts;
