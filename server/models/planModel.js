import mongoose, { Schema } from "mongoose";

const planSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, //[activity,lodging,flights]
    planName: { type: String, required: true }, //activity,   lodging(tên chỗ ở),           flights(Hãng hàng không)
    startDate: { type: Date, required: true }, //activity,    lodging (Ngày nhận phòng),    flights(Ngày khởi hành)
    endDate: { type: Date, required: true }, //activity,      lodging ((Ngày trả phòng),    flights(Ngày tới)
    startTime: { type: String, required: false }, //activity, lodging (Giờ nhận phòng),     flights(Giờ khởi hành)
    endTime: { type: String, required: false }, //activity,   lodging (Giờ trả phòng),      flights(Giờ tới)
    address: { type: String, required: false }, //activity,   lodging (Địa chỉ),            flights(sân bay)
    info: { type: String, required: false }, //activity,      lodging (Liên hệ nhà cung cấp), flights(Số chuyến bay)
    phone: { type: String, required: false }, //              lodging (Điện thoại nhà cung cấp), flights(ĐT Sân bay)
    web: { type: String, required: false }, //                lodging (Web nhà cung cấp),      flights(Web Sân bay)
    email: { type: String, required: false }, //              lodging (email nhà cung cấp),  flights(email Sân bay)
    number: { type: String, required: false }, //             lodging (Số phòng),           flights(Chỗ ngồi)
    describe: { type: String, required: false }, //           lodging (mô tả),              flights(Bữa ăn Sân bay)
    destination: { type: String, required: false }, //                                      flights(điểm đến)
    arrivalGate: { type: String, required: false }, //                                      flights(cổng đến)
    departureGate: { type: String, required: false }, //                                    flights(cổng khởi hành)
  },
  { timestamps: true }
);

const Plans = mongoose.model("Plans", planSchema);

export default Plans;
