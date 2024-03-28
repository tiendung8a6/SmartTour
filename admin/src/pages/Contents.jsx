import {
  Button,
  Menu,
  Pagination,
  Table,
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

import { Comments, ConfirmDialog, EditPost, Loading } from "../components";
import { useAction, useContent, useDeletePost } from "../hooks/post-hook";
import { getWriterInfo } from "../hooks/user-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";

const Contents = () => {
  const { colorScheme } = useMantineColorScheme();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useStore();
  const { setOpen, commentId, setCommentId, setPost } = useCommentStore();
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isPending, mutate } = useContent(toast, user?.token);
  const useDelete = useDeletePost(toast, user?.token);
  const useActions = useAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editPost, setEditPost] = useState(false);
  const [writerNames, setWriterNames] = useState({}); // State to store writer names

  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);

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
        useDelete.mutate(selected);

      case "status":
        useActions.mutate({ id: selected, status: status });
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

  // Function to fetch writer names based on IDs
  const fetchWriterNames = async (ids) => {
    const names = {};
    for (const id of ids) {
      const writerInfo = await getWriterInfo(id);
      names[id] = writerInfo?.name || "Unknown";
    }
    setWriterNames(names);
  };

  useEffect(() => {
    if (data?.data?.length > 0) {
      const userIds = data.data.map((el) => el?.user);
      fetchWriterNames(userIds);
    }
  }, [data]);

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <p
          className={`
            ${
              colorScheme === "dark" ? "text-white" : "text-vlack"
            } text-lg pb-1 font-semibold`}
        >
          Contents ({" "}
          <span className="text-sm">
            {data?.data?.length * data?.page +
              " of " +
              data?.totalPost +
              " records"}
          </span>
          )
        </p>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Post Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Views</Table.Th>
              <Table.Th>Comments</Table.Th>
              <Table.Th>Post Date</Table.Th>
              <Table.Th>Edit Date</Table.Th>
              <Table.Th>Writer</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody className="">
            {data?.data?.length > 0 &&
              data?.data?.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className={theme ? "text-gray-400" : `text-slate-600`}
                >
                  <Table.Td className="flex gap-2 items-center">
                    <img
                      src={el?.img}
                      alt={el?.title}
                      className="w-10 h-10 rounded-full object-conver"
                    />

                    <p className="text-base text-justify">{el?.title}</p>
                  </Table.Td>
                  <Table.Td>{el?.cat}</Table.Td>
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

                  <Table.Td>{writerNames[el?.user]}</Table.Td>
                  <Table.Td>
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
                      {el?.status === true ? "Active" : "Disabled"}
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
                          Delete Post
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {data?.data?.length < 1 && (
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
    </>
  );
};

export default Contents;
