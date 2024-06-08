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
        <p className="text-xl font-bold text-gray-900">Thông báo</p>
        <button className="text-sm font-medium text-blue-700 ">
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
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX2Ycbywy8vTtHVpMRpvzLVDhB1ohFUeuOJg&s"
                  />
                  <div className="ml-4 flex flex-col sm:w-96">
                    <p className="mb-1 font-bold text-gray-800">Hệ thống</p>
                    <div className="text-sm text-gray-400 ">
                      {/* <span className="shrink-0 mr-1 text-rose-500">
                        <svg
                          className="inline h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      </span>
                      <span className="mr-1 font-medium text-rose-500">
                        liked your comment:
                      </span> */}
                      <span className="text-sm text-gray-700">
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
          <div className="flex flex-col items-center justify-center bg-gray-50 h-[400px]">
            <ActionIcon
              variant="outline"
              size="lg"
              radius="xl"
              aria-label="Settings"
            >
              <IconBell style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
            <p className="text-gray-700 mt-2">Chưa có thông báo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
