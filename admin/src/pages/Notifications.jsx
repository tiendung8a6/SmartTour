import React, { useEffect, useState } from "react";
import {
  Button,
  Menu,
  Table,
  TextInput,
  useMantineColorScheme,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import "moment/locale/vi";
import { AiOutlineSetting } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {
  IconSearch,
  IconNotification,
  IconBellPlus,
  IconMailPlus,
} from "@tabler/icons-react";

import {
  WebNotifications,
  EmailNotifications,
  ConfirmDialog,
  Loading,
  Pagination,
} from "../components";
import {
  useNotifications,
  useDeleteNotification,
} from "../hooks/notifications_hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";

const Notifications = () => {
  moment.updateLocale("vi", {
    relativeTime: {
      future: "trong %s",
      past: "%s trước",
      s: "vài giây",
      ss: "%d giây",
      m: "1 phút",
      mm: "%d phút",
      h: "1 giờ",
      hh: "%d giờ",
      d: "1 ngày",
      dd: "%d ngày",
      M: "1 tháng",
      MM: "%d tháng",
      y: "1 năm",
      yy: "%d năm",
    },
  });
  moment.locale("vi");

  const { colorScheme } = useMantineColorScheme();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [isOpening, setIsOpening] = useState(false);

  const { data, isPending, mutate } = useNotifications(toast, user?.token);
  const useDelete = useDeleteNotification(toast, user?.token, mutate);
  // const useActions = useAction(toast, user?.token);
  const [selected, setSelected] = useState("");
  const [type, setType] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const theme = colorScheme === "dark";

  const handleSubmit = () => {
    open();
  };

  const handleActions = () => {
    switch (type) {
      case "delete":
        useDelete.mutate(selected);
        break;
      // case "status":
      //   useActions.mutate({ id: selected, status: status });
      //   break;
      default:
        break;
    }
    fetchData();
    setIsConfirmDialogOpen(false);
  };

  const handlePerformAction = (val, id, status) => {
    setSelected(id);
    setType(val);
    setIsConfirmDialogOpen(true);
  };

  const handleNotification = () => {
    setIsOpening(true);
    open();
  };

  const fetchData = () => {
    updateURL({ page, navigate, location });
    mutate(page);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  //TÌM KIẾM BỎ QUA DẤU
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const containsString = (str, substr) => {
    return removeDiacritics(str)
      .toLowerCase()
      .includes(removeDiacritics(substr).toLowerCase());
  };

  const filteredNotifications = data?.data?.filter((notification) => {
    return notification?.user?.some((user) =>
      containsString(user?.email, searchTerm)
    );
  });

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <p
            className={`
              ${
                colorScheme === "dark" ? "text-white" : "text-black"
              } text-lg pb-1 font-semibold`}
          >
            Thông báo (
            <span className="text-sm">
              {"Danh sách: " + data?.totalNotifications + " thông báo "}
            </span>
            )
          </p>
          <div className="flex items-center">
            <TextInput
              leftSection={<IconSearch size={15} />}
              placeholder="Tìm kiếm theo Email"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <Button
              className={`${
                colorScheme === "dark"
                  ? "hover:text-sky-700"
                  : "hover:text-blue-600"
              } text-sky-600`}
              onClick={() => setSearchTerm("")}
              variant="light"
            >
              Xóa
            </Button>
          </div>
        </div>

        <div className="flex justify-end items-center mb-4 ">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button
                leftSection={<IconBellPlus size={15} />}
                radius="xl"
                className={
                  theme
                    ? "bg-sky-600 hover:bg-sky-500 "
                    : "bg-black hover:bg-neutral-800"
                } // onClick={() => handleSubmit()}
              >
                Gửi Thông Báo
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Cách thức</Menu.Label>
              <Menu.Item
                className={
                  colorScheme === "dark"
                    ? "hover:text-white hover:bg-gray-600 "
                    : "hover:bg-gray-100"
                }
                leftSection={
                  <IconNotification
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
                onClick={() => handleNotification()}
              >
                Gửi Qua Hệ Thống
              </Menu.Item>
              {/* <Menu.Divider /> */}
              <Menu.Item
                className={
                  colorScheme === "dark"
                    ? "hover:text-white hover:bg-gray-600 "
                    : "hover:bg-gray-100"
                }
                leftSection={
                  <IconMailPlus style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => handleSubmit()}
              >
                Gửi Qua Email
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-black text-white">
              <Table.Th>Email</Table.Th>
              <Table.Th>Nội dung</Table.Th>
              <Table.Th>Hình thức</Table.Th>
              <Table.Th>Ngày gửi</Table.Th>
              <Table.Th>Người gửi</Table.Th>
              <Table.Th>Hành Động</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody className="">
            {filteredNotifications?.length > 0 &&
              filteredNotifications?.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className={theme ? "text-gray-400" : `text-slate-600`}
                >
                  <Table.Td>
                    {el?.user?.map((user) => (
                      <div key={user?._id}>{user?.email}</div>
                    ))}
                  </Table.Td>

                  <Table.Td className="text-justify">
                    <div dangerouslySetInnerHTML={{ __html: el?.reason }} />
                  </Table.Td>
                  <Table.Td className="text-justify whitespace-nowrap">
                    <span
                      className={`${
                        el?.method === "automatic"
                          ? "bg-sky-800 text-white"
                          : "bg-green-600 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full font-semibold px-4 py-1.5`}
                    >
                      {el?.method === "automatic" ? "Hệ thống" : "Email"}
                    </span>
                  </Table.Td>
                  <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
                  <Table.Td className="text-justify whitespace-nowrap">
                    <span
                      className={`${
                        el?.sender === "system"
                          ? "bg-lime-800 text-white"
                          : "bg-pink-600 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full font-semibold px-4 py-1.5`}
                    >
                      {el?.sender === "system" ? "Tự động" : "Quản trị viên"}
                    </span>
                  </Table.Td>
                  <Table.Td width={5}>
                    <Menu
                      transitionProps={{
                        transition: "rotate-right",
                        duration: 150,
                      }}
                      shadow="lg"
                      width={200}
                    >
                      <Menu.Target>
                        <Button>
                          <BiDotsVerticalRounded
                            className={
                              colorScheme === "dark"
                                ? "text-white text-lg"
                                : "text-slate-900 text-lg"
                            }
                          />
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        {/* <Menu.Item
                          leftSection={<BiSolidEdit />}
                          onClick={() => handleEdit(el)}
                        >
                          Chỉnh Sửa
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<AiOutlineSetting />}
                          onClick={() =>
                            handlePerformAction("status", el?._id, !el?.status)
                          }
                        >
                          {el?.status ? "Ẩn Danh Mục " : "Hiện Danh Mục"}
                        </Menu.Item>
                        <Menu.Divider /> */}

                        <Menu.Label>Thao tác nguy hiểm</Menu.Label>

                        <Menu.Item
                          className={
                            colorScheme === "dark"
                              ? "hover:text-rose-500 hover:bg-gray-600 "
                              : "hover:bg-gray-100"
                          }
                          color="red"
                          leftSection={<MdOutlineDeleteOutline />}
                          onClick={() => handlePerformAction("delete", el?._id)}
                        >
                          Xóa Thông Báo
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {filteredNotifications?.length < 1 && (
            <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
          )}
        </Table>

        <div className="w-full mt-5 flex items-center justify-center">
          <Pagination
            total={data?.numOfPage}
            onChange={(value) => setPage(value)}
          />
        </div>

        <Loading visible={isPending} />
        <Toaster richColors />
      </div>

      {isOpening && (
        <WebNotifications
          key={selected}
          opened={opened}
          close={() => {
            close();
            setIsOpening(false);
          }}
        />
      )}

      {!isOpening && !opened && (
        <ConfirmDialog
          message="Bạn có chắc muốn thực hiện hành động này?"
          opened={isConfirmDialogOpen}
          close={() => setIsConfirmDialogOpen(false)}
          handleClick={handleActions}
        />
      )}

      {!isOpening && <EmailNotifications opened={opened} close={close} />}
    </>
  );
};

export default Notifications;
