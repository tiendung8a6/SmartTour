import {
  Button,
  Table,
  TextInput,
  useMantineColorScheme,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { IconSearch } from "@tabler/icons-react";

import {
  Comments,
  ConfirmDialog,
  EditPost,
  Loading,
  WritePost,
  Pagination,
} from "../components";
import { useAction, usePayment, useDeletePost } from "../hooks/post-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";

const Payments = () => {
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

  const { data, isPending, mutate } = usePayment(toast, user?.token);
  const useDelete = useDeletePost(toast, user?.token, mutate);
  const useActions = useAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editPost, setEditPost] = useState(false);

  const [writerNames, setWriterNames] = useState({}); // State to store writer names

  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [searchTerm, setSearchTerm] = useState("");

  const theme = colorScheme === "dark";

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
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
  const filteredPayments = data?.data?.filter((el) => {
    return (
      containsString(el?.orderNumber, searchTerm) ||
      containsString(el?.user?.email, searchTerm)
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
            Thanh toán (
            <span className="text-sm">
              {"Danh sách: " + data?.totalPayments + " thanh toán "}
            </span>
            )
          </p>
          <div className="flex items-center">
            <TextInput
              leftSection={<IconSearch size={15} />}
              className="w-50"
              placeholder="Tìm kiếm theo ID và Email"
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
              <Table.Th>ID</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Số Điện Thoại</Table.Th>
              <Table.Th>Phương Thức</Table.Th>
              <Table.Th>Loại Hình</Table.Th>
              <Table.Th>Giá Tiền</Table.Th>
              <Table.Th>Trạng Thái</Table.Th>
              <Table.Th>Ngày Tạo</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody className="">
            {filteredPayments?.length > 0 &&
              filteredPayments?.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className={theme ? "text-gray-400" : `text-slate-600`}
                >
                  <Table.Td>{el?.orderNumber}</Table.Td>
                  <Table.Td>{el?.user?.email}</Table.Td>
                  <Table.Td>{el?.phone}</Table.Td>
                  <Table.Td>
                    {el?.payments === "VNPAY" ? (
                      <Badge fullWidth color="blue" variant="light" size="lg">
                        VNPAY
                      </Badge>
                    ) : (
                      <Badge color="indigo" fullWidth variant="light" size="lg">
                        STRIPE
                      </Badge>
                    )}
                  </Table.Td>

                  <Table.Td>{el?.paymentMethod}</Table.Td>
                  <Table.Td className="font-bold">
                    {formatCurrency(el?.totalPrice)}
                  </Table.Td>
                  <Table.Td>
                    {el?.paymentStatus === "paid" ? (
                      <Badge fullWidth color="teal" size="lg">
                        Đã trả
                      </Badge>
                    ) : (
                      <Badge color="pink" fullWidth size="lg">
                        Chưa trả
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td>{moment(el?.createdAt).format("L")}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {filteredPayments?.length < 1 && (
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

      {editPost && (
        <EditPost
          key={selected}
          opened={opened}
          close={() => {
            close();
            setEditPost(false);
          }}
        />
      )}

      {commentId && <Comments />}

      {!editPost && <WritePost opened={opened} close={close} />}
    </>
  );
};

export default Payments;
