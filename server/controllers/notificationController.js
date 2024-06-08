import Notifications from "../models/notificationModel.js";
import Users from "../models/userModel.js";

export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const notifications = await Notifications.find({ user: id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thấy thông báo" });
  }
};
