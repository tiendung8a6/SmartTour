import mongoose from "mongoose";
const Schema = mongoose.Schema;
//Generate random numbers for order
const generateOrderNumber = () => {
  const randomTxt = Math.random().toString(36).substring(7).toUpperCase();
  const randomNumbers = Math.floor(1000 + Math.random() * 90000);
  return randomTxt + randomNumbers;
};
const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    phone: { type: String, required: false },
    orderItems: [{ type: Object, required: true }],
    shippingAddress: { type: Object, required: false },
    orderNumber: { type: String, default: generateOrderNumber, unique: true },

    //Hình thức thanh toán
    payments: { type: String, required: false },

    //VNPAY
    vnp_TxnRef: { type: Number },

    //for stripe payment
    paymentStatus: { type: String, default: "Not paid" },
    paymentMethod: { type: String, default: "Chưa cập nhật" },
    totalPrice: { type: Number, default: 0 },
    currency: { type: String, default: "Not specified" },
  },
  {
    timestamps: true,
  }
);

//compile to form model
const Order = mongoose.model("Order", OrderSchema);

export default Order;
