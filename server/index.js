import bodyParser from "body-parser";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
//securty packges
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";
import Users from "./models/userModel.js";
import Order from "./models/orderModel.js";
import Notifications from "./models/notificationModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;

dbConnection();

//Stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      // console.log("event");
    } catch (err) {
      // console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      //find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );
      if (order) {
        let points;
        switch (totalAmount) {
          case 100000:
            points = 100;
            break;
          case 200000:
            points = 200;
            break;
          case 300000:
            points = 350;
            break;
          default:
            points = 0;
        }

        // Update user's points
        const updatedUser = await Users.findByIdAndUpdate(
          order.user,
          { $inc: { points: points } },
          { new: true }
        );

        if (updatedUser) {
          // Save notification
          await Notifications.create({
            user: order.user,
            pointsAdded: points,
            reason: `Nhận thành công ${points} điểm với phương thức toán bằng Stripe với ID: ${order.orderNumber} `,
          });
        } else {
          console.error("Không thể cập nhật điểm người dùng");
        }
      }
    } else {
      return;
    }
    response.send();
  }
);

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);

//error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

app.get("/", (req, res) => {
  res.send(`api is running`);
});
