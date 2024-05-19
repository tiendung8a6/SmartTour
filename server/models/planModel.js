import mongoose, { Schema } from "mongoose";

const planSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, //[activity,lodging,flights,car,concert,theater,parking,restaurant,rail]
    planName: { type: String, required: true }, //activity,   lodging(tên chỗ ở),                     restaurant(Nhà hàng),             flights(Hãng hàng không)  ,car(Tên đại lý),         concert&theater&camp(Tên sự kiện)       ,parking(Tên bãi đậu xe)
    estimatedPrice: { type: Number, required: false },
    actualPrice: { type: Number, required: false },
    startDate: { type: Date, required: true }, //activity,    lodging (Ngày nhận phòng)               restaurant(ngày bắt đầu),   ,     flights(Ngày khởi hành)   ,car(ngày đón),           concert&theater&camp(ngày bắt đầu)      ,parking(Ngày gửi)
    endDate: { type: Date, required: true }, //activity,      lodging ((Ngày trả phòng),              restaurant(ngày kết thúc),        flights(Ngày tới)         ,car(thời gian đón)       concert&theater&camp(ngày kết thúc)     ,parking(Ngày trả)
    startTime: { type: String, required: true }, //activity, lodging (Giờ nhận phòng),                restaurant(giờ bắt đầu),          flights(Giờ khởi hành)    ,car(ngày trả)            concert&theater&camp(Tzan bắt đầu)       ,parking(Tzan bắt đầu)
    endTime: { type: String, required: true }, //activity,   lodging (Giờ trả phòng),                 restaurant(giờ kết thúc),         flights(Giờ tới)          ,car(thời gian trả)       concert&theater&camp(Tzan kết thúc)      ,parking(Tzan kết thúc)
    startAddress: { type: String, required: false }, //activity,   lodging (Địa chỉ),                      restaurant(Địa chỉ),              flights(sân bay)          ,car(Địa chỉ)             concert&theater&camp(Địa điểm)          ,parking(Địa chỉ)
    endAddress: { type: String, required: false }, //                                                                                   flights(điểm đến)
    info: { type: String, required: false }, //activity,      lodging (Liên hệ nhà cung cấp),         restaurant(Liên hệ),              flights(Số chuyến bay),                           concert&theater&camp(Thông tin hoạt động) ,parking(Thông tin liên hệ)
    phone: { type: String, required: false }, //              lodging (Điện thoại nhà cung cấp),      restaurant(SĐT),                  flights(ĐT Sân bay)          ,car(SĐT đai lý)  concert&theater&camp(SĐT)                 ,parking(SĐT)
    web: { type: String, required: false }, //                lodging (Web nhà cung cấp),             restaurant(web),                  flights(Web Sân bay)          ,car(web đại lý)   concert&theater&camp(web)                 ,parking(Web)
    email: { type: String, required: false }, //              lodging (email nhà cung cấp),           restaurant(email),                flights(email Sân bay)          ,car(email đại lý) concert&theater&camp(email)               ,parking(email)
    number: { type: String, required: false }, //             lodging (Số phòng),                                                       flights(Chỗ ngồi)                                   concert&theater&camp(Chỗ ngồi)
    service: { type: String, required: false }, //                                                                                                                 ,car(Số lượng)                                                     ,parking(số lượng)
    describe: { type: String, required: false }, //           lodging (mô tả),                        restaurant(Ẩm thực),               flights(Bữa ăn Sân bay)   ,car(Chi tiết xe)         concert&theater&camp(Địa chỉ)
    form: { type: String, required: false }, //                                                       restaurant(Quy định trang phục),   flights(Hạng vé)             ,car(loại xe)            concert&theater&camp(Hạng vé)
    price: { type: String, required: false }, //                                                      restaurant(giá tiền),              flights(Giá vé)              ,car(Chi phí)           concert&theater&camp(Giá vé)               ,parking(Giá tiền)
    departureGate: { type: String, required: false }, //                                                                                 flights(cổng khởi hành)                             concert&theater&camp(Cổng vào)
    arrivalGate: { type: String, required: false }, //                                                                                  flights(cổng đến/cổng ra)
  },
  { timestamps: true }
);

const Plans = mongoose.model("Plans", planSchema);

export default Plans;
