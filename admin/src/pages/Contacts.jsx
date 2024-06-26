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
import { BiDotsVerticalRounded, BiMailSend } from "react-icons/bi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { IconSearch } from "@tabler/icons-react";
import {
  Comments,
  ConfirmDialog,
  EditContact,
  Loading,
  Pagination,
} from "../components";
import { useContacts } from "../hooks/contacts_hook";

import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { updateURL } from "../utils";

const Contacts = () => {
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
  const { setOpen, commentId, setCommentId, setContact } = useCommentStore();
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isPending, mutate } = useContacts(toast, user?.token);
  // const useDelete = useDeletePost(toast, user?.token);
  // const useActions = useAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editContact, setEditContact] = useState(false);

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

  const handleActions = () => {
    switch (type) {
      case "delete":
        // useDelete.mutate(selected);
        break;
      case "status":
        // useActions.mutate({ id: selected, status: status });
        break;
      default:
        break;
    }
    fetchData();
    close();
  };

  const handleEdit = (el) => {
    setSelected(el._id);
    setContact(el);
    setEditContact(true);
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

  const filteredContacts = data?.data?.filter((contact) => {
    return (
      containsString(contact.name, searchTerm) ||
      containsString(contact.email, searchTerm)
    );
  });

  // TÌM KIẾM NHẬN DẠNG DẤU
  // const filteredContacts = data?.data?.filter((contact) => {
  //   return (
  //     contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // });

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
            Liên hệ (
            <span className="text-sm">
              {"Danh sách: " + data?.totalContacts + " liên hệ"}
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
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-black text-white">
              <Table.Th>Tên</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Số Điện Thoại</Table.Th>
              <Table.Th>Nội Dung</Table.Th>
              <Table.Th>Ngày Nhận</Table.Th>
              <Table.Th>Trạng Thái</Table.Th>
              <Table.Th>Hành Động</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody className="">
            {filteredContacts?.length > 0 &&
              filteredContacts?.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className={theme ? "text-gray-400" : `text-slate-600`}
                >
                  <Table.Td>{el?.name}</Table.Td>
                  <Table.Td>{el?.email}</Table.Td>
                  <Table.Td>{el?.phone}</Table.Td>
                  <Table.Td className="text-justify">{el?.message}</Table.Td>
                  <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
                  <Table.Td className="text-justify whitespace-nowrap">
                    <span
                      className={`${
                        el?.isReply
                          ? "bg-blue-800 text-white"
                          : "bg-green-600 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full  font-semibold px-4 py-1.5`}
                    >
                      {el?.isReply === true ? "Đã Trả Lời" : "Mới"}
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
                          leftSection={<BiMailSend />}
                          onClick={() => handleEdit(el)}
                        >
                          Trả Lời
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {filteredContacts?.length < 1 && (
            <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
          )}
        </Table>

        <div className="w-full mt-5 flex items-center justify-center">
          <Pagination
            total={data?.numOfPages}
            onChange={(value) => setPage(value)}
          />
        </div>

        <Loading visible={isPending} />
        <Toaster richColors />
      </div>

      {!editContact && (
        <ConfirmDialog
          message="Bạn có chắc muốn thực hiện hành động này?"
          opened={opened}
          close={close}
          handleClick={handleActions}
        />
      )}

      {editContact && (
        <EditContact key={selected} opened={opened} close={close} />
      )}

      {commentId && <Comments />}
    </>
  );
};

export default Contacts;
