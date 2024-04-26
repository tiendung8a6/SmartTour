import mongoose, { Schema } from "mongoose";

const planSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, //[activity,lodging,flights,car,concert,theater]
    planName: { type: String, required: true }, //activity,   lodging(tên chỗ ở),           flights(Hãng hàng không)  ,car(Tên đại lý),         concert&theater&camp(Tên sự kiện)
    startDate: { type: Date, required: true }, //activity,    lodging (Ngày nhận phòng),    flights(Ngày khởi hành)   ,car(ngày đón),           concert&theater&camp(ngày bắt đầu)
    endDate: { type: Date, required: true }, //activity,      lodging ((Ngày trả phòng),    flights(Ngày tới)         ,car(thời gian đón)       concert&theater&camp(ngày kết thúc)
    startTime: { type: String, required: true }, //activity, lodging (Giờ nhận phòng),     flights(Giờ khởi hành)    ,car(ngày trả)            concert&theater&camp(Tzan bắt đầu)
    endTime: { type: String, required: true }, //activity,   lodging (Giờ trả phòng),      flights(Giờ tới)          ,car(thời gian trả)       concert&theater&camp(Tzan kết thúc)
    address: { type: String, required: false }, //activity,   lodging (Địa chỉ),            flights(sân bay)          ,car(Địa chỉ)             concert&theater&camp(Địa điểm)
    info: { type: String, required: false }, //activity,      lodging (Liên hệ nhà cung cấp), flights(Số chuyến bay),                           concert&theater&camp(Thông tin hoạt động)
    phone: { type: String, required: false }, //              lodging (Điện thoại nhà cung cấp), flights(ĐT Sân bay)          ,car(SĐT đai lý)  concert&theater&camp(SĐT)
    web: { type: String, required: false }, //                lodging (Web nhà cung cấp),      flights(Web Sân bay)          ,car(web đại lý)   concert&theater&camp(web)
    email: { type: String, required: false }, //              lodging (email nhà cung cấp),  flights(email Sân bay)          ,car(email đại lý) concert&theater&camp(email)
    number: { type: String, required: false }, //             lodging (Số phòng),           flights(Chỗ ngồi)                                   concert&theater&camp(Chỗ ngồi)
    total: { type: String, required: false }, //                                                                       ,car(Số lượng)
    describe: { type: String, required: false }, //           lodging (mô tả),              flights(Bữa ăn Sân bay)   ,car(Chi tiết xe)         concert&theater&camp(Địa chỉ)
    form: { type: String, required: false }, //                                           flights(Hạng vé)             ,car(loại xe)            concert&theater&camp(Hạng vé)
    price: { type: String, required: false }, //                                           flights(Giá vé)              ,car(Chi phí)           concert&theater&camp(Giá vé)
    destination: { type: String, required: false }, //                                      flights(điểm đến)
    departureGate: { type: String, required: false }, //                                    flights(cổng khởi hành)                             concert&theater&camp(Cổng vào)
    arrivalGate: { type: String, required: false }, //                                      flights(cổng đến/cổng ra)
  },
  { timestamps: true }
);

const Plans = mongoose.model("Plans", planSchema);

export default Plans;
