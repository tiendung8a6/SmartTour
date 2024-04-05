import { Modal } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { usePosts, useDeleteComment } from "../hooks/category-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import Profile from "../assets/profile.png";
import moment from "moment";
import "moment/locale/vi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IconUserEdit } from "@tabler/icons-react";
import { ConfirmDialog, Loading } from ".";
const PostCategory = () => {
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

  const { openComment, commentId, setOpen } = useCommentStore();
  const { user } = useStore();
  const useDelete = useDeleteComment(user?.token);
  const { mutate, isPending, data } = usePosts();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteConfirmation = (commentId) => {
    setCommentToDelete(commentId);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    useDelete.mutate({ id: commentToDelete, postId: commentId });
    setConfirmDelete(false);
  };

  useEffect(() => {
    mutate(commentId);
  }, [commentId, useDelete.isPending]);

  return (
    <>
      <Modal
        opened={openComment}
        onClose={handleClose}
        title={`Bài viết (${data?.data?.length})`}
        centered
        size="75%"
      >
        <div className="w-full h-full pb-6">
          {data?.data?.length === 0 ? (
            <p className="text-sm text-gray-700">Không Có Bài Viết</p>
          ) : (
            <div className="w-full h-full flex flex-col gap-6 px-2">
              {data?.data?.map(
                ({ _id, title, img, user, desc, post, createdAt }) => (
                  <div
                    key={_id}
                    className="w-full flex gap-4 items-start content-center justify-items-center text-justify"
                  >
                    <img
                      src={img}
                      alt={title}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                    />
                    <div className="w-full">
                      <div className="w-full flex justify-between">
                        <div className="w-full flex flex-col md:flex-row md:items-center gap-2">
                          <p className="text-sm md:text-base text-slate-600 dark:text-gray-400 font-medium">
                            {title}
                          </p>
                          <span className="text-slate-700 dark:text-gray-500 text-xs italic text-left">
                            {moment(createdAt).fromNow()}
                          </span>
                        </div>
                        {/* <div className="flex gap-1 items-center cursor-pointer">
                          <span
                            className="text-sm text-red-600 cursor-pointer"
                            onClick={() => handleDeleteConfirmation(_id)}
                          >
                            <MdOutlineDeleteOutline />
                          </span>
                          <span
                            className="text-sm text-red-600 cursor-pointer"
                            onClick={() => handleDeleteConfirmation(_id)}
                          >
                            Delete
                          </span>
                        </div> */}
                      </div>

                      <div className="pl-6 pt-1">
                        <span className="w-full flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-700 dark:text-gray-400 justify-start">
                          <span className="flex">
                            <IconUserEdit stroke={1.75} />
                          </span>
                          <img
                            src={user?.image}
                            alt={title}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                          />
                          <span>{user?.name}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          <Loading visible={isPending} />
        </div>
      </Modal>

      {confirmDelete && (
        <ConfirmDialog
          opened={confirmDelete}
          close={() => setConfirmDelete(false)}
          handleClick={handleDelete}
          message="Bạn có chắc muốn thực hiện hành động này?"
        ></ConfirmDialog>
      )}
    </>
  );
};

export default PostCategory;
