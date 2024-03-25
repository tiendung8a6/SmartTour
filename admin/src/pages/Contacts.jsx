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
import { BiDotsVerticalRounded, BiMailSend } from "react-icons/bi";
import { MdMessage, MdOutlineDeleteOutline } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";

import { Comments, ConfirmDialog, EditContact, Loading } from "../components";
// import { useAction, useContent, useDeletePost } from "../hooks/post-hook";
import { useContent } from "../hooks/contacts_hook";

import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";

const Contacts = () => {
  const { colorScheme } = useMantineColorScheme();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useStore();
  const { setOpen, commentId, setCommentId, setContact } = useCommentStore();
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isPending, mutate } = useContent(toast, user?.token);
  // const useDelete = useDeletePost(toast, user?.token);
  // const useActions = useAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editContact, setEditContact] = useState(false);

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

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <p
          className={`
            ${
              colorScheme === "dark" ? "text-white" : "text-vlack"
            } text-lg pb-1 font-semibold`}
        >
          Contact (
          <span className="text-sm">
            {"Total: " + data?.totalContacts + " records"}
          </span>
          )
        </p>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-black text-white">
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Message</Table.Th>
              <Table.Th>Sent date</Table.Th>
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
                  <Table.Td>{el?.name}</Table.Td>
                  <Table.Td>{el?.email}</Table.Td>
                  <Table.Td>{el?.phone}</Table.Td>
                  <Table.Td>{el?.message}</Table.Td>
                  <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
                  <Table.Td>
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
                      {el?.isReply === true ? "Replied" : "New"}
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
                          leftSection={<BiMailSend />}
                          onClick={() => handleEdit(el)}
                        >
                          Reply Contact
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
            total={data?.numOfPages}
            siblings={3}
            defaultValue={data?.page}
            // gap={10}
            color="gray"
            withEdges
            onChange={(value) => setPage(value)}
          />
        </div>

        <Loading visible={isPending} />
        <Toaster richColors />
      </div>

      {!editContact && (
        <ConfirmDialog
          message="Are you sure you want to perform this action?"
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
