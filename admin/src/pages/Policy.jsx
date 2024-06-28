import {
  Button,
  Menu,
  Pagination,
  Table,
  useMantineColorScheme,
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

import { Comments, ConfirmDialog, EditPolicy, Loading } from "../components";
// import { useAction, useContent, useDeletePost } from "../hooks/post-hook";
import { useContent } from "../hooks/policy-hook";

import useCommentStore from "../store/comments";
import useStore from "../store/store";
import { formatNumber, updateURL } from "../utils";

const Policy = () => {
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
          Chính sách (
          <span className="text-sm">
            {"Danh sách: " + data?.totalPolicies + " chính sách"}
          </span>
          )
        </p>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr className="bg-black text-white">
              <Table.Th>Tiêu Đề</Table.Th>
              <Table.Th>Nội Dung</Table.Th>
              <Table.Th>Chỉnh Sửa Gần Đây</Table.Th>
              <Table.Th>Hành Động</Table.Th>
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
                    {el?.title}
                  </Table.Td>
                  <Table.Td className="text-justify">
                    <div dangerouslySetInnerHTML={{ __html: el?.content }} />
                  </Table.Td>
                  <Table.Td className="flex gap-2 items-center text-justify">
                    {moment(el?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
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
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {data?.data?.length < 1 && (
            <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
          )}
        </Table>

        <Loading visible={isPending} />
        <Toaster richColors />
      </div>

      {!editPolicy && (
        <ConfirmDialog
          message="Bạn có chắc muốn thực hiện hành động này?"
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
