import React, { useEffect, useState } from "react";
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
import { AiOutlineEye, AiOutlineSetting } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { MdMessage, MdOutlineDeleteOutline } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {
  IconSearch,
  IconSquarePlus,
  IconBlockquote,
} from "@tabler/icons-react";

import {
  Comments,
  ConfirmDialog,
  EditPost,
  Loading,
  CreateCategory,
  PostCategory,
  EditCategory,
  Pagination,
} from "../components";
import {
  useAction,
  useCategory,
  useDeleteCategory,
  getPostsByCategory,
} from "../hooks/category-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";

const Categories = () => {
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

  const { data, isPending, mutate } = useCategory(toast, user?.token);
  const useDelete = useDeleteCategory(toast, user?.token, mutate);
  const useActions = useAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editPost, setEditPost] = useState(false);

  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [searchTerm, setSearchTerm] = useState("");
  const [postCounts, setPostCounts] = useState({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const theme = colorScheme === "dark";

  const handleComment = async (id) => {
    const postCount = await getPostsCountByCategory(id);
    setCommentId(id);
    setOpen(true);
  };

  // Lấy số lượng bài post cho mỗi category khi dữ liệu category thay đổi
  useEffect(() => {
    const fetchPostCounts = async () => {
      const counts = {};
      for (const category of data?.data || []) {
        const count = await getPostsCountByCategory(category._id);
        counts[category._id] = count;
      }
      setPostCounts(counts);
    };
    fetchPostCounts();
  }, [data]);

  const getPostsCountByCategory = async (categoryId) => {
    try {
      const posts = await getPostsByCategory(categoryId);
      return posts.length;
    } catch (error) {
      console.error("Error getting posts count for category:", error);
      return 0;
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
  const filteredCategories = data?.data?.filter((el) => {
    return containsString(el.label, searchTerm);
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
          <Button
            leftSection={<IconSquarePlus size={15} />}
            radius="xl"
            className={
              theme
                ? "bg-sky-600 hover:bg-sky-500 "
                : "bg-black hover:bg-neutral-800"
            }
            onClick={() => handleSubmit()}
          >
            Tạo Danh Mục
          </Button>
        </div>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-black text-white">
              <Table.Th>Tên</Table.Th>
              <Table.Th>Bài Viết</Table.Th>
              <Table.Th>Màu Sắc</Table.Th>
              <Table.Th>Ngày Tạo</Table.Th>
              <Table.Th>Ngày Chỉnh Sửa</Table.Th>
              <Table.Th>Trạng Thái</Table.Th>
              <Table.Th>Hành Động</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody className="">
            {filteredCategories?.length > 0 &&
              filteredCategories?.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className={theme ? "text-gray-400" : `text-slate-600`}
                >
                  <Table.Td>
                    <p
                      style={{ backgroundColor: `${el?.color}` }}
                      className="w-fit rounded-full px-2 py-0.5 text-white text-[12px] 2xl:text-sm"
                    >
                      {el?.label}
                    </p>
                  </Table.Td>

                  <Table.Td onClick={() => handleComment(el?._id)}>
                    <div className="flex gap-1 items-center cursor-pointer">
                      <IconBlockquote size={18} className="text-slate-500" />
                      {postCounts[el._id]?.toString() || "N/A"}
                    </div>
                  </Table.Td>

                  <Table.Td>{el?.color}</Table.Td>
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
                      } rounded-full font-semibold px-4 py-1.5`}
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
                          leftSection={<BiSolidEdit />}
                          onClick={() => handleEdit(el)}
                        >
                          Chỉnh Sửa
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

          {filteredCategories?.length < 1 && (
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

export default Categories;
