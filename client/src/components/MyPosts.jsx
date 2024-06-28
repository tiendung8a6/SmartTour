import {
  Button,
  Menu,
  Pagination,
  Table,
  TextInput,
  useMantineColorScheme,
  Container,
  Grid,
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
import {
  IconSearch,
  IconPencilPlus,
  IconEraser,
  IconDots,
} from "@tabler/icons-react";
import {
  ConfirmDialog,
  EditPost,
  LoadingClient,
  CommentMyPost,
  // WritePost,
} from "../components";
import { useContent, useDeletePost, useAction } from "../hooks/client-hook";
import useCommentStore from "../store/comments";
import useStore from "../store";
import { formatNumber, updateURL } from "../utils";
const MyPosts = () => {
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

  const { data, isPending, mutate } = useContent(toast, user?.token);
  const useDelete = useDeletePost(toast, user?.token, mutate);
  const useActions = useAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editPost, setEditPost] = useState(false);

  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [searchTerm, setSearchTerm] = useState("");

  const theme = colorScheme === "dark";

  const handleGoToPost = (post) => {
    navigate(`/blog/${post?.slug}/${post?._id}`);
  };
  const handleComment = (id) => {
    setCommentId(id);
    setOpen(true);
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
    return containsString(el.title, searchTerm);
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
            Bài viết (
            <span className="text-sm">
              {"Danh sách: " + data?.totalPost + " bài viết "}
            </span>
            )
          </p>
          <div className="flex items-center">
            <TextInput
              leftSection={<IconSearch size={15} />}
              placeholder="Tìm kiếm theo Tiêu đề"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <Button onClick={() => setSearchTerm("")} variant="light">
              Xóa
            </Button>
          </div>
        </div>
        <Table withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-[#228BE6] text-white">
              <Table.Th>Tiêu Đề</Table.Th>
              <Table.Th>Danh Mục</Table.Th>
              <Table.Th>Lượt Xem</Table.Th>
              <Table.Th>Bình Luận</Table.Th>
              <Table.Th>Ngày Đăng</Table.Th>
              <Table.Th>Ngày Chỉnh Sửa</Table.Th>
              <Table.Th>Trạng Thái</Table.Th>
              <Table.Th>Hành Động</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredContents?.length > 0 &&
              filteredContents?.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className={
                    theme
                      ? "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 "
                      : `text-slate-600 hover:bg-gray-100 dark:hover:bg-gray-800`
                  }
                >
                  <Table.Td className="flex gap-2 items-center">
                    <img
                      src={el?.img}
                      alt={el?.title}
                      className="w-10 h-10 rounded-full object-conver"
                    />

                    <p className="text-base text-justify">{el?.title}</p>
                  </Table.Td>
                  <Table.Td>{el?.cat?.label}</Table.Td>
                  <Table.Td>
                    <div className="flex gap-1 items-center">
                      <AiOutlineEye size={18} />
                      {formatNumber(el?.views?.length)}
                    </div>
                  </Table.Td>
                  <Table.Td
                    onClick={() => handleComment(el?._id, el?.comments?.length)}
                  >
                    <div className="flex gap-1 items-center cursor-pointer">
                      <MdMessage size={18} className="text-slate-500" />
                      {formatNumber(el?.comments?.length)}
                    </div>
                  </Table.Td>
                  <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
                  <Table.Td>{moment(el?.updatedAt).fromNow()}</Table.Td>

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
                        <Button className="bg-inherit	hover:bg-green-200">
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
                          leftSection={<AiOutlineEye />}
                          onClick={() => handleGoToPost(el)}
                          disabled={!el?.status}
                        >
                          Xem Bài Viết
                        </Menu.Item>

                        <Menu.Item
                          leftSection={<MdMessage />}
                          onClick={() =>
                            handleComment(el?._id, el?.comments?.length)
                          }
                        >
                          Xem Bình Luận
                        </Menu.Item>

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
                          {el?.status ? "Ẩn Bài Viết" : "Công Khai"}
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Label>Thao tác nguy hiểm</Menu.Label>

                        <Menu.Item
                          color="red"
                          leftSection={<MdOutlineDeleteOutline />}
                          onClick={() => handlePerformAction("delete", el?._id)}
                        >
                          Xóa Bài Viết
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
            siblings={1}
            defaultValue={data?.page}
            // gap={10}
            // color='lime'
            withEdges
            onChange={(value) => setPage(value)}
          />
        </div>

        <LoadingClient visible={isPending} />
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

      {commentId && <CommentMyPost />}

      {/* {!editPost && <WritePost opened={opened} close={close} />} */}
    </>
  );
};

export default MyPosts;
