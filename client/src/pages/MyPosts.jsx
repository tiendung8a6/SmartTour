import {
  Button,
  Menu,
  Pagination,
  Table,
  TextInput,
  useMantineColorScheme,
  Container,
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
  // WritePost,
} from "../components";
import { useContent, useDeletePost } from "../hooks/client-hook";
import useCommentStore from "../store/comments";
import useStore from "../store";
import { formatNumber, updateURL } from "../utils";
import { Grid } from "@mantine/core";
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
  const { setPost } = useCommentStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { data, isPending, mutate } = useContent(toast, user?.token);
  const useDelete = useDeletePost(toast, user?.token, mutate);

  const [selected, setSelected] = useState("");
  const [editPost, setEditPost] = useState(false);

  const [type, setType] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [searchTerm, setSearchTerm] = useState("");

  const theme = colorScheme === "dark";

  const handleActions = () => {
    switch (type) {
      case "delete":
        useDelete.mutate(selected);
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

  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const containsString = (str, substr) => {
    return removeDiacritics(str)
      .toLowerCase()
      .includes(removeDiacritics(substr).toLowerCase());
  };

  // Filter content based on search term
  const filteredContents = data?.data?.filter((el) => {
    return containsString(el.title, searchTerm);
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="w-full h-full flex flex-col">
        <Grid className="flex justify-between items-center mb-4">
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
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
          </Grid.Col>
          <Grid.Col
            span={{ base: 12, md: 6, lg: 6 }}
            className={`flex ${
              window.innerWidth < 985 ? "justify-start" : "justify-end"
            }`}
          >
            <div className="flex items-center">
              <TextInput
                leftSection={<IconSearch size={15} />}
                placeholder="Tìm kiếm theo Tiêu đề"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </Grid.Col>
        </Grid>

        <div className="w-[90%]  drop-shadow-lg ">
          {filteredContents?.length > 0 &&
            filteredContents?.map((el) => (
              <>
                <Grid
                  className=" mt-10 border shadow-xl  mx-auto rounded-xl"
                  key={el?._id}
                >
                  <Grid.Col
                    span={{ base: 12, md: 12, lg: 4 }}
                    className=" flex justify-center items-center"
                  >
                    <img
                      src={el?.img}
                      alt={el?.title}
                      className="min-w-[228px]  h-[128px] bg-black rounded-md"
                    />
                  </Grid.Col>

                  <Grid.Col
                    span={{ base: 12, md: 12, lg: 7 }}
                    className="text-wrap"
                  >
                    <span className="text-lg font-medium">
                      {el?.title.slice(0, 30) + "..."}
                    </span>{" "}
                    <br></br>
                    <span className="font-medium text-gray-400 text-sm">
                      {el?.cat?.label}
                    </span>{" "}
                    <br></br>
                    <span
                      className="break-words"
                      dangerouslySetInnerHTML={{
                        __html: el?.desc.slice(0, 50) + "...",
                      }}
                    ></span>
                    <div className="flex ">
                      <div className="flex gap-1 items-center">
                        <AiOutlineEye size={18} />
                        {formatNumber(el?.views?.length)}
                      </div>
                      <div className="flex gap-1 items-center ml-2">
                        <MdMessage size={18} />
                        {formatNumber(el?.comments?.length)}
                      </div>
                    </div>
                    {moment(el?.updatedAt).fromNow()}
                  </Grid.Col>

                  <Grid.Col
                    span={{ base: 12, md: 12, lg: 1 }}
                    className="text-wrap flex justify-end"
                  >
                    <Menu
                      transitionProps={{
                        transition: "rotate-right",
                        duration: 150,
                      }}
                      shadow="lg"
                      width={200}
                    >
                      <Menu.Target>
                        <IconDots className=" m-2" />
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<BiSolidEdit />}
                          onClick={() => handleEdit(el)}
                        >
                          Chỉnh Sửa
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Label>Thao tác nguy hiểm</Menu.Label>

                        <Menu.Item
                          color="red"
                          leftSection={<MdOutlineDeleteOutline />}
                          onClick={() => handlePerformAction("delete", el?._id)}
                        >
                          Xóa Bài Đăng
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Grid.Col>
                </Grid>
              </>
            ))}
        </div>

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
          opened={isConfirmDialogOpen}
          close={() => setIsConfirmDialogOpen(false)}
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
    </>
  );
};

export default MyPosts;
