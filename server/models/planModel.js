import mongoose, { Schema } from "mongoose";

const planSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    planName: { type: String, required: true }, //activity,   lodging(tên chỗ ở)
    startDate: { type: Date, required: true }, //activity,    lodging (Ngày nhận phòng)
    endDate: { type: Date, required: true }, //activity,      lodging ((Ngày trả phòng))
    startTime: { type: String, required: false }, //activity, lodging (Giờ nhận phòng)
    endTime: { type: String, required: false }, //activity,   lodging (Giờ trả phòng)
    address: { type: String, required: false }, //activity,   lodging (Địa chỉ)
    info: { type: String, required: false }, //activity,      lodging (Liên hệ nhà cung cấp)
    phone: { type: String, required: false }, //              lodging (Điện thoại nhà cung cấp)
    web: { type: String, required: false }, //                lodging (Web nhà cung cấp)
    email: { type: String, required: false }, //              lodging (email nhà cung cấp)
    number: { type: String, required: false }, //             lodging (Số phòng)
    describe: { type: String, required: false }, //           lodging (mô tả)
  },
  { timestamps: true }
);

const Plans = mongoose.model("Plans", planSchema);

export default Plans;
