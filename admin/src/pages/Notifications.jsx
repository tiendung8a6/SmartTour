import React, { useEffect, useState } from "react";
import {
  Button,
  Menu,
  Pagination,
  Table,
  TextInput,
  useMantineColorScheme,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import "moment/locale/vi";
import { AiOutlineEye, AiOutlineSetting } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { MdMessage, MdOutlineDeleteOutline } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {
  IconSearch,
  IconSquarePlus,
  IconBlockquote,
  IconBellPlus,
  IconMailPlus,
} from "@tabler/icons-react";

import {
  Comments,
  ConfirmDialog,
  EditPost,
  Loading,
  CreateCategory,
  PostCategory,
  EditCategory,
} from "../components";
import { useNotifications } from "../hooks/notifications_hook";
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
  const { setOpen, commentId, setCommentId, setPost } = useCommentStore();
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isPending, mutate } = useNotifications(toast, user?.token);
  // const useDelete = useDeleteCategory(toast, user?.token, mutate);
  // const useActions = useAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editPost, setEditPost] = useState(false);

  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [searchTerm, setSearchTerm] = useState("");
  const [postCounts, setPostCounts] = useState({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const theme = colorScheme === "dark";

  const handleSubmit = () => {
    open();
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
    setIsConfirmDialogOpen(false);
  };

  const handlePerformAction = (val, id, status) => {
    setEditPost(false);
    setSelected(id);
    setType(val);
    setStatus(status);
    setIsConfirmDialogOpen(true);
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

  const filteredNotifications = data?.data?.filter((contact) => {
    return (
      // containsString(contact.user, searchTerm) ||
      containsString(contact.reason, searchTerm)
    );
  });
  console.log("....", filteredNotifications);

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
            Danh mục (
            <span className="text-sm">
              {"Danh sách: " + data?.totalCategories + " danh mục "}
            </span>
            )
          </p>
          <div className="flex items-center">
            <TextInput
              leftSection={<IconSearch size={15} />}
              placeholder="Tìm kiếm theo Tên"
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
                className="hover:bg-slate-100"
                leftSection={
                  <IconMailPlus style={{ width: rem(14), height: rem(14) }} />
                }
                // onClick={() => handleSubmit()}
              >
                Gửi Qua Hệ Thống
              </Menu.Item>
              {/* <Menu.Divider /> */}
              <Menu.Item
                className="hover:bg-slate-100"
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
              <Table.Th>Ngày gửi</Table.Th>
              <Table.Th>Hình thức</Table.Th>
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

                  <Table.Td className="text-justify">{el?.reason}</Table.Td>
                  <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
                  <Table.Td className="text-justify whitespace-nowrap">
                    <span
                      className={`${
                        el?.type === "system"
                          ? "bg-sky-800 text-white"
                          : "bg-pink-600 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full font-semibold px-4 py-1.5`}
                    >
                      {el?.type === "system" ? "Hệ thống" : "Email"}
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
                          Xóa Danh Mục
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
            siblings={1}
            defaultValue={data?.page}
            // gap={10}
            // color='lime'
            withEdges
            onChange={(value) => setPage(value)}
          />
        </div>

        <Loading visible={isPending} />
        <Toaster richColors />
      </div>

      {!editPost && !opened && (
        <ConfirmDialog
          message="Bạn có chắc muốn thực hiện hành động này?"
          opened={isConfirmDialogOpen}
          close={() => setIsConfirmDialogOpen(false)}
          handleClick={handleActions}
        />
      )}

      {editPost && (
        <EditCategory
          key={selected}
          opened={opened}
          close={() => {
            close();
            setEditPost(false);
          }}
        />
      )}

      {commentId && <PostCategory />}

      {<CreateCategory opened={opened} close={close} />}
    </>
  );
};

export default Notifications;
