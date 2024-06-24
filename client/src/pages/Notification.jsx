import React, { useState, useEffect } from "react";
import useStore from "../store";
import { Menu, ActionIcon, ScrollArea, Indicator, Text } from "@mantine/core";
import { IconMail, IconBell } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { getNotification } from "../utils/apiCalls";
import moment from "moment";

const Notification = () => {
  const { user } = useStore();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      if (user?.user?._id) {
        const data = await getNotification(user.user._id);
        setNotifications(data || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.user?._id]);

  return (
    <div className="mx-auto my-4 max-w-lg rounded-xl border border-gray-200 px-4 py-8 shadow-xl">
      <div className="mb-4 flex justify-between border-b pb-3">
        <p className="text-xl font-bold text-gray-900 dark:text-sky-500">
          Thông báo
        </p>
        <button className="text-sm font-medium text-blue-700 dark:text-blue-500">
          Đánh dấu tất cả là đã đọc
        </button>
      </div>
      <div>
        {notifications.length > 0 ? (
          <ScrollArea h={460} offsetScrollbars>
            {notifications.map((notification, index) => (
              <div className="mb-3 space-y-4 py-2 " tabIndex="0">
                <div className="relative flex items-center">
                  <img
                    alt="Thông báo"
                    className="h-10 w-10 rounded-full object-cover"
                    src={
                      notification.sender === "system"
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX2Ycbywy8vTtHVpMRpvzLVDhB1ohFUeuOJg&s"
                        : "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
                    }
                  />
                  <div className="ml-4 flex flex-col sm:w-96">
                    <p className="mb-1 font-bold text-gray-800 dark:text-white">
                      {notification.sender === "system"
                        ? "Hệ thống"
                        : "Quản trị viên"}
                    </p>
                    <div className="text-sm text-gray-400 ">
                      <span className="text-sm text-gray-700 dark:text-gray-400">
                        {notification.reason}
                      </span>
                    </div>
                  </div>
                  <span className="absolute top-0 right-2 text-sm mr-1 font-medium text-sky-600">
                    {moment(notification?.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <ActionIcon
              variant="outline"
              size="lg"
              radius="xl"
              aria-label="Settings"
            >
              <IconBell style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
            <p className="text-gray-700 mt-2 dark:text-white">
              Chưa có thông báo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
