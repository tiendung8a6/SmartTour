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
import { AiFillLock } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";

import {
  Comments,
  ConfirmDialog,
  EditPost,
  Loading,
  Followers,
} from "../components";
import { useUserAction, useUsers, useDeleteUser } from "../hooks/user-hook";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";
import useCommentStore from "../store/comments";

const Users = () => {
  const { colorScheme } = useMantineColorScheme();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setOpen, commentId, setCommentId } = useCommentStore();

  const { user } = useStore();
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isPending, mutate } = useUsers(toast, user?.token);
  const useDelete = useDeleteUser(toast, user?.token, mutate);
  const useActions = useUserAction(toast, user?.token);

  const [selected, setSelected] = useState("");
  const [editPost, setEditPost] = useState(false);

  const [type, setType] = useState(null);
  const [isLock, setIsLock] = useState(null);
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
        useDelete.mutate(selected);
        break;
      case "isLock":
        useActions.mutate({ id: selected, isLock: isLock });
        break;
      default:
        break;
    }
    fetchData();
    close();
  };

  const handlePerformAction = (val, id, isLock) => {
    setEditPost(false);
    setSelected(id);
    setType(val);
    setIsLock(isLock);
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

  const filteredUsers = data?.data?.filter((user) => {
    return (
      containsString(user.name, searchTerm) ||
      containsString(user.email, searchTerm)
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
            Users ({" "}
            <span className="text-sm">
              {"Total: " + data?.totalUsers + " records "}
            </span>
            )
          </p>
          <div className="flex items-center">
            <TextInput
              placeholder="Search by Name or Email"
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
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-black text-white">
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Access Control</Table.Th>
              <Table.Th>Followers</Table.Th>
              <Table.Th>Authentication</Table.Th>
              <Table.Th>Registration Date</Table.Th>
              <Table.Th>Last Modified</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody className="">
            {filteredUsers?.length > 0 &&
              filteredUsers?.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className={theme ? "text-gray-400" : `text-slate-600`}
                >
                  <Table.Td className="lg:flex lg:items-center lg:space-x-2 text-justify">
                    <img
                      src={el?.image}
                      alt={el?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="text-base lg:ml-2">{el?.name}</p>
                  </Table.Td>
                  <Table.Td className="text-justify">{el?.email}</Table.Td>
                  <Table.Td className="text-justify">{el?.provider}</Table.Td>
                  <Table.Td
                    onClick={() =>
                      handleComment(el?._id, el?.followers?.length)
                    }
                  >
                    <div className="flex gap-1 items-center cursor-pointer">
                      <BiSolidLike size={18} className="text-slate-500" />
                      {formatNumber(el?.followers?.length)}
                    </div>
                  </Table.Td>
                  <Table.Td className="text-justify">
                    <span
                      className={`${
                        el?.emailVerified
                          ? "bg-green-700 text-white"
                          : "bg-amber-700 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full  font-semibold px-4 py-1.5`}
                    >
                      {el?.emailVerified === true ? "Verified" : "Unverified"}
                    </span>
                  </Table.Td>
                  <Table.Td className="text-justify">
                    {moment(el?.createdAt).fromNow()}
                  </Table.Td>
                  <Table.Td>{moment(el?.updatedAt).fromNow()}</Table.Td>
                  <Table.Td className="text-justify">
                    <span
                      className={`${
                        el?.isLock
                          ? "bg-fuchsia-900 text-white"
                          : "bg-yellow-600 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full  font-semibold px-4 py-1.5`}
                    >
                      {el?.isLock === true ? "Locked" : "Unlocked"}
                    </span>
                  </Table.Td>
                  <Table.Td className="text-justify">
                    <span
                      className={`${
                        el?.isAdmin
                          ? "bg-rose-900 text-white"
                          : "bg-neutral-500 text-white"
                      } ${
                        colorScheme === "dark"
                          ? "bg-opacity-30"
                          : "bg-opacity-70"
                      } rounded-full  font-semibold px-4 py-1.5`}
                    >
                      {el?.isAdmin === true ? "Admin" : "User"}
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
                          leftSection={<AiFillLock />}
                          onClick={() =>
                            handlePerformAction("isLock", el?._id, !el?.isLock)
                          }
                        >
                          {el?.isLock ? "Unlock" : "Lock"}
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Label>Danger zone</Menu.Label>

                        <Menu.Item
                          color="red"
                          leftSection={<MdOutlineDeleteOutline />}
                          onClick={() => handlePerformAction("delete", el?._id)}
                        >
                          Delete User
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {filteredUsers?.length < 1 && (
            <Table.Caption>No Data Found.</Table.Caption>
          )}
        </Table>

        <div className="w-full mt-5 flex items-center justify-center">
          <Pagination
            total={data?.numOfPages}
            siblings={1}
            defaultValue={data?.page}
            // gap={10}
            // color="lime"
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

      {commentId && <Followers />}
    </>
  );
};

export default Users;
