import {
  Button,
  Menu,
  Pagination,
  Table,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineSetting } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { MdMessage, MdOutlineDeleteOutline } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { IconPencilPlus } from "@tabler/icons-react";
import {
  Comments,
  ConfirmDialog,
  EditPost,
  Loading,
  CreateCategory,
} from "../components";
import {
  useAction,
  useCategory,
  useDeleteCategory,
} from "../hooks/category-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";

const Categories = () => {
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
  const [createPost, setCreatePost] = useState(false);

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
    setCreatePost(true);
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
    close();
  };

  const handlePerformAction = (val, id, status) => {
    setEditPost(false);
    setSelected(id);
    setType(val);
    setStatus(status);
    open();
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
            Categories (
            <span className="text-sm">
              {"Total: " + data?.totalCategories + " records "}
            </span>
            )
          </p>
          <div className="flex items-center">
            <TextInput
              placeholder="Search by Title"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <Button
              className="ml-2"
              onClick={() => setSearchTerm("")}
              variant="light"
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="flex justify-end items-center mb-4 ">
          <Button
            leftSection={<IconPencilPlus size={15} />}
            radius="xl"
            className={theme ? "bg-blue-600" : "bg-black"}
            onClick={() => handleSubmit()}
          >
            Create Category
          </Button>
        </div>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-black text-white">
              <Table.Th>label</Table.Th>
              <Table.Th>color</Table.Th>
              <Table.Th>Post Date</Table.Th>
              <Table.Th>Edit Date</Table.Th>
              <Table.Th>Action</Table.Th>
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
                  <Table.Td>{el?.color}</Table.Td>
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
                          leftSection={<BiSolidEdit />}
                          onClick={() => handleEdit(el)}
                        >
                          Edit Post
                        </Menu.Item>

                        <Menu.Item
                          leftSection={<AiOutlineSetting />}
                          onClick={() =>
                            handlePerformAction("status", el?._id, !el?.status)
                          }
                        >
                          {el?.status ? "Disable" : "Enable"}
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Label>Danger zone</Menu.Label>

                        <Menu.Item
                          color="red"
                          leftSection={<MdOutlineDeleteOutline />}
                          onClick={() => handlePerformAction("delete", el?._id)}
                        >
                          Delete Category
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {filteredCategories?.length < 1 && (
            <Table.Caption>No Data Found.</Table.Caption>
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

      {!editPost && (
        <ConfirmDialog
          message="Are you sure you want to perform this action?"
          opened={opened}
          close={close}
          handleClick={handleActions}
        />
      )}

      {editPost && <EditPost key={selected} opened={opened} close={close} />}

      {commentId && <Comments />}

      {createPost && <CreateCategory opened={opened} close={close} />}
    </>
  );
};

export default Categories;
