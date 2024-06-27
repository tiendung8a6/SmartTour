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
import { AiOutlineEye, AiOutlineSetting } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { MdMessage, MdOutlineDeleteOutline } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { IconSearch } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import {
  Comments,
  ConfirmDialog,
  EditPost,
  Loading,
  WritePost,
  Pagination,
} from "../components";
import { useAction, useTrip, useDeleteTrip } from "../hooks/trip-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";

const Trips = () => {
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
  const { setOpen, commentId, setCommentId, setPost } = useCommentStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { data, isPending, mutate } = useTrip(toast, user?.token);
  const useDelete = useDeleteTrip(toast, user?.token, mutate);
  const useActions = useAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editPost, setEditPost] = useState(false);

  const [writerNames, setWriterNames] = useState({}); // State to store writer names

  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
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
    open();
  };

  const handleActions = () => {
    switch (type) {
      case "delete":
        useDelete.mutate(selected);
        break;
      case "status":
        useActions.mutate({ id: selected, status: status });
        break;
      default:
        break;
    }
    fetchData();
    setIsConfirmDialogOpen(false); // tắt ConfirmDialog
  };

  const handlePerformAction = (val, id, status) => {
    setEditPost(false);
    setSelected(id);
    setType(val);
    setStatus(status);
    setIsConfirmDialogOpen(true); // mở ConfirmDialog thay vì gọi open()
  };

  const handleEdit = (el) => {
    setSelected(el._id);
    setPost(el);
    setEditPost(true);
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

  // Filter content based on search term
  const filteredContents = data?.data?.filter((el) => {
    return containsString(el.tripName, searchTerm);
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
            Chuyến đi (
            <span className="text-sm">
              {"Danh sách: " + data?.totalTrips + " chuyến đi "}
            </span>
            )
          </p>
          <div className="flex items-center">
            <TextInput
              leftSection={<IconSearch size={15} />}
              placeholder="Tìm kiếm theo tên chuyến đi"
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
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-black text-white">
              <Table.Th>Tên chuyến đi</Table.Th>
              <Table.Th>Thành Phố</Table.Th>
              <Table.Th>Số lượng</Table.Th>
              <Table.Th>Ngày bắt đầu</Table.Th>
              <Table.Th>Ngày kết thúc</Table.Th>
              <Table.Th>Trạng Thái</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Cập nhật gần đây</Table.Th>
              <Table.Th>Hành Động</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody className="">
            {filteredContents?.length > 0 &&
              filteredContents?.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className={theme ? "text-gray-400" : `text-slate-600`}
                >
                  <Table.Td className="flex gap-2 items-center">
                    <img
                      src={el?.image}
                      alt={el?.tripName}
                      className="w-10 h-10 object-conver"
                    />

                    <p>{el?.tripName}</p>
                  </Table.Td>
                  <Table.Td>{el?.city}</Table.Td>
                  <Table.Td>{el?.total}</Table.Td>
                  <Table.Td>{moment(el?.startDate).fromNow()}</Table.Td>
                  <Table.Td>{moment(el?.endDate).fromNow()}</Table.Td>
                  <Table.Td className="text-justify whitespace-nowrap">
                    <span
                      className={`${
                        el?.status
                          ? "bg-green-700 text-white"
                          : "bg-red-700 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full  font-semibold px-4 py-1.5`}
                    >
                      {el?.status === true ? "Công Khai" : "Đã Ẩn"}
                    </span>
                  </Table.Td>
                  <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
                  <Table.Td>{moment(el?.updatedAt).fromNow()}</Table.Td>

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
                          leftSection={<AiOutlineEye />}
                        >
                          <Link
                            to={`${process.env.REACT_APP_BASE_URL}/trip/${el?._id}/public`}
                          >
                            Xem Chi Tiết
                          </Link>
                        </Menu.Item>

                        <Menu.Item
                          className={
                            colorScheme === "dark"
                              ? "hover:text-white hover:bg-gray-600 "
                              : "hover:bg-gray-100"
                          }
                          leftSection={<AiOutlineSetting />}
                          onClick={() =>
                            handlePerformAction("status", el?._id, !el?.status)
                          }
                        >
                          {el?.status ? "Ẩn Chuyến Đi" : "Công Khai"}
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
                          Xóa Chuyến Đi
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {filteredContents?.length < 1 && (
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

      {!editPost && !opened && (
        <ConfirmDialog
          message="Bạn có chắc muốn thực hiện hành động này?"
          opened={isConfirmDialogOpen} // sử dụng state mới
          close={() => setIsConfirmDialogOpen(false)} // đóng ConfirmDialog khi cần
          handleClick={handleActions}
        />
      )}
    </>
  );
};

export default Trips;
