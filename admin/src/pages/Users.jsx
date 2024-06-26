import {
  Button,
  Menu,
  Table,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { AiFillLock } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import { IconSearch, IconUserPlus, IconCoinBitcoin } from "@tabler/icons-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {
  ConfirmDialog,
  Loading,
  Followers,
  CreateAdmin,
  Pagination,
} from "../components";
import { useUserAction, useUsers, useDeleteUser } from "../hooks/user-hook";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";
import useCommentStore from "../store/comments";

const Users = () => {
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

  const { setOpen, commentId, setCommentId, setUser } = useCommentStore();

  const { user } = useStore();
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isPending, mutate } = useUsers(toast, user?.token);
  const useDelete = useDeleteUser(toast, user?.token, mutate);
  const useActions = useUserAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editUser, setEditUser] = useState(false);

  const [type, setType] = useState(null);
  const [isLock, setIsLock] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [searchTerm, setSearchTerm] = useState("");

  const theme = colorScheme === "dark";

  const handleComment = (id, size) => {
    if (size > 0) {
      setCommentId(id);
      setOpen(true);
    }
  };

  const handleSubmit = () => {
    setUser(true);
    setEditUser(true);
    open();
  };

  const handleActions = () => {
    switch (type) {
      case "delete":
        useDelete.mutate(selected);
        break;
      case "isLock":
        useActions.mutate({ id: selected, isLock: isLock });
        break;
      default:
        break;
    }
    fetchData();
    close();
  };

  const handlePerformAction = (val, id, isLock) => {
    setEditUser(false);
    setSelected(id);
    setType(val);
    setIsLock(isLock);
    open();
  };

  const fetchData = () => {
    updateURL({ page, navigate, location });
    mutate(page);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  // Function to remove diacritics from a string
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Function to check if a string contains another string (case-insensitive, diacritic-insensitive)
  const containsString = (str, substr) => {
    return removeDiacritics(str)
      .toLowerCase()
      .includes(removeDiacritics(substr).toLowerCase());
  };

  const filteredUsers = data?.data?.filter((user) => {
    return (
      containsString(user.name, searchTerm) ||
      containsString(user.email, searchTerm)
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
            Người dùng ({" "}
            <span className="text-sm">
              {"Danh sách: " + data?.totalUsers + " người dùng "}
            </span>
            )
          </p>
          <div className="flex items-center">
            <TextInput
              className="w-60"
              leftSection={<IconSearch size={15} />}
              placeholder="Tìm kiếm theo Tên hoặc Email"
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
          <Button
            leftSection={<IconUserPlus size={15} />}
            radius="xl"
            className={
              theme
                ? "bg-sky-600 hover:bg-sky-500 "
                : "bg-black hover:bg-neutral-800"
            }
            onClick={() => handleSubmit()}
          >
            Tạo Tài Khoản
          </Button>
        </div>

        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-black text-white">
              <Table.Th>#</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Hình Thức</Table.Th>
              <Table.Th>Người Theo Dõi</Table.Th>
              <Table.Th>Điểm Thưởng</Table.Th>
              <Table.Th>Xác Thực OTP</Table.Th>
              <Table.Th>Ngày Tạo</Table.Th>
              {/* <Table.Th>Chỉnh Sửa</Table.Th> */}
              <Table.Th>Trạng Thái</Table.Th>
              <Table.Th>Vai Trò</Table.Th>
              <Table.Th>Hành Động</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredUsers?.length > 0 &&
              filteredUsers?.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className={theme ? "text-gray-400" : `text-slate-600`}
                >
                  <Table.Td className="lg:flex lg:items-center lg:space-x-2 text-justify">
                    <img
                      src={el?.image}
                      alt={el?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {/* <p className="text-justify">{el?.name}</p> */}
                  </Table.Td>
                  <Table.Td className="text-justify">{el?.email}</Table.Td>
                  <Table.Td className="text-justify">{el?.provider}</Table.Td>
                  <Table.Td
                    onClick={() =>
                      handleComment(el?._id, el?.followers?.length)
                    }
                  >
                    <div className="flex gap-1 items-center cursor-pointer">
                      <BiSolidLike size={18} className="text-slate-500" />
                      {formatNumber(el?.followers?.length)}
                    </div>
                  </Table.Td>
                  <Table.Td className="text-justify font-bold">
                    <div class="flex justify-start space-x-1 font-semibold">
                      <div className="flex items-center text-yellow-500">
                        <IconCoinBitcoin size="1rem" stroke={2} />
                      </div>
                      <div>{el?.points}</div>
                      <div>Điểm</div>
                    </div>
                  </Table.Td>
                  <Table.Td className="text-justify whitespace-nowrap">
                    <span
                      className={`${
                        el?.emailVerified
                          ? "bg-green-700 text-white"
                          : "bg-amber-700 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full  font-semibold px-4 py-1.5`}
                    >
                      {el?.emailVerified === true
                        ? "Xác Thực"
                        : "Chưa Xác Thực"}
                    </span>
                  </Table.Td>
                  <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
                  {/* <Table.Td>{moment(el?.updatedAt).fromNow()}</Table.Td> */}
                  <Table.Td className="text-justify whitespace-nowrap">
                    <span
                      className={`${
                        el?.isLock
                          ? "bg-fuchsia-900 text-white"
                          : "bg-yellow-600 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full  font-semibold px-4 py-1.5`}
                    >
                      {el?.isLock === true ? "Đã Khóa" : "Chưa Khóa"}
                    </span>
                  </Table.Td>
                  <Table.Td className="text-justify whitespace-nowrap">
                    <span
                      className={`${
                        el?.isAdmin
                          ? "bg-rose-900 text-white"
                          : "bg-neutral-500 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full  font-semibold px-4 py-1.5`}
                    >
                      {el?.isAdmin === true ? "Quản Trị" : "Người Dùng"}
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
                        <Menu.Item
                          className={
                            colorScheme === "dark"
                              ? "hover:text-white hover:bg-gray-600 "
                              : "hover:bg-gray-100"
                          }
                          leftSection={<AiFillLock />}
                          onClick={() =>
                            handlePerformAction("isLock", el?._id, !el?.isLock)
                          }
                        >
                          {el?.isLock ? "Mở Khóa" : "Khóa"}
                        </Menu.Item>

                        <Menu.Divider />

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
                          Xóa Người Dùng
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {filteredUsers?.length < 1 && (
            <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
          )}
        </Table>

        <div className="w-full mt-5 flex items-center justify-center">
          <Pagination
            total={data?.numOfPages}
            onChange={(value) => setPage(value)}
            // siblings={1}
            // defaultValue={data?.page}
            // gap={10}
            // color="lime"
            // withEdges
          />
        </div>

        <Loading visible={isPending} />
        <Toaster richColors />
      </div>

      {!editUser && (
        <ConfirmDialog
          message="Bạn có chắc muốn thực hiện hành động này?"
          opened={opened}
          close={close}
          handleClick={handleActions}
        />
      )}

      {editUser && <CreateAdmin key={selected} opened={opened} close={close} />}

      {commentId && <Followers />}
    </>
  );
};

export default Users;
