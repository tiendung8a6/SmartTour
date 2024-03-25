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

import { Comments, ConfirmDialog, EditPolicy, Loading } from "../components";
// import { useAction, useContent, useDeletePost } from "../hooks/post-hook";
import { useContent } from "../hooks/policy-hook";

import { getWriterInfo } from "../hooks/user-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";

const Policy = () => {
  const { colorScheme } = useMantineColorScheme();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useStore();
  const { setOpen, commentId, setCommentId, setPolicy } = useCommentStore();
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isPending, mutate } = useContent(toast, user?.token);
  // const useDelete = useDeletePost(toast, user?.token);
  // const useActions = useAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editPolicy, setEditPolicy] = useState(false);

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
      // useDelete.mutate(selected);

      case "status":
      // useActions.mutate({ id: selected, status: status });
    }
    fetchData();
    close();
  };

  const handleEdit = (el) => {
    setSelected(el._id);
    setPolicy(el);
    setEditPolicy(true);
    open();
  };

  const fetchData = () => {
    updateURL({ page, navigate, location });
    mutate(page);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

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
              data?.totalPolicy +
              " records"}
          </span>
          )
        </p>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Policy Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>updatedAt</Table.Th>
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
                    <p className="text-base">{el?.title}</p>
                  </Table.Td>
                  <Table.Td>{el?.content}</Table.Td>
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
                          Edit Policy
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

        <Loading visible={isPending} />
        <Toaster richColors />
      </div>

      {!editPolicy && (
        <ConfirmDialog
          message="Are you sure you want to perform this action?"
          opened={opened}
          close={close}
          handleClick={handleActions}
        />
      )}

      {editPolicy && (
        <EditPolicy key={selected} opened={opened} close={close} />
      )}

      {commentId && <Comments />}
    </>
  );
};

export default Policy;
