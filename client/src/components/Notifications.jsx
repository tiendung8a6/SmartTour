import React, { useState, useEffect } from "react";
import useStore from "../store";
import { Menu, ActionIcon, ScrollArea, Indicator, Text } from "@mantine/core";
import { IconMail, IconBell } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { getNotification } from "../utils/apiCalls";
import moment from "moment";

const Notifications = () => {
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
    <Menu>
      <Menu.Target>
        <Indicator processing inline label="Mới" color="red" size={12}>
          <ActionIcon
            variant="gradient"
            size="lg"
            radius="md"
            gradient={{ from: "blue", to: "cyan", deg: 79 }}
          >
            <IconMail style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        <div
          style={{
            width: notifications.length > 0 ? "20rem" : "15rem",
            right: 0,
            marginTop: "0.5rem",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            zIndex: 20,
          }}
        >
          {notifications.length > 0 ? (
            <ScrollArea h={266} offsetScrollbars>
              {notifications.map((notification, index) => (
                <Text
                  key={index}
                  className="flex items-center px-4 py-3 border-b hover:bg-gray-100 -mx-2"
                >
                  <img
                    alt="Thông báo"
                    className="h-8 w-8 rounded-full object-cover mx-1"
                    src={
                      notification.sender === "system"
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX2Ycbywy8vTtHVpMRpvzLVDhB1ohFUeuOJg&s"
                        : "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
                    }
                  />
                  <p className="text-gray-600 text-sm mx-2">
                    <span className="font-bold text-sm">
                      {notification.sender === "system"
                        ? "Hệ thống: "
                        : "Quản trị viên: "}
                    </span>{" "}
                    {notification.reason}{" "}
                    <span className="text-sky-600 font-bold text-xs">
                      · {moment(notification?.createdAt).fromNow()}
                    </span>
                  </p>
                </Text>
              ))}
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center bg-gray-100 h-[70px]">
              <ActionIcon
                variant="outline"
                size="lg"
                radius="xl"
                aria-label="Settings"
              >
                <IconBell
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
              <p className="text-gray-700 mt-2">Chưa có thông báo</p>
            </div>
          )}
          {notifications.length > 0 && (
            <Link
              to="/notification"
              className="block bg-sky-800 text-white hover:bg-sky-700 text-center font-bold py-2"
            >
              Xem tất cả thông báo
            </Link>

            // <a
            //   href="/notification"
            //   className="block bg-sky-800 text-white hover:bg-sky-700 text-center font-bold py-2"
            // >
            //   Xem tất cả thông báo
            // </a>
          )}
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default Notifications;
