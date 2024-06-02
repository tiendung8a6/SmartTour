import { Modal } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useFollowers, useDeleteFollower } from "../hooks/post-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import Profile from "../assets/profile.png";
import moment from "moment";
import "moment/locale/vi";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { ConfirmDialog, Loading } from "../components";
const Followers = () => {
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
  const useDelete = useDeleteFollower(user?.token);
  const { mutate, isPending, data } = useFollowers();

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
    useDelete.mutate({ id: commentToDelete, writerId: commentId });
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
        title={`Người theo dõi (${data?.followers?.length})`}
        centered
        size="lg"
      >
        <div className="w-full h-full pb-6">
          {data?.followers?.length === 0 ? (
            <p className="text-sm text-gray-700">Không Có Người Theo Dõi</p>
          ) : (
            <div className="w-full h-full flex flex-col gap-6 px-2">
              {data?.followers?.map(({ _id, followerId }) => (
                <div key={_id} className="w-full flex gap-4 items-start">
                  <img
                    src={followerId?.image || Profile}
                    alt={followerId?.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
                  <div className="w-full">
                    <div className="w-full flex justify-between">
                      <div className="w-full flex flex-col md:flex-row md:items-center gap-2">
                        <p className="text-sm md:text-base text-slate-600 dark:text-gray-400 font-medium">
                          {followerId?.name}
                        </p>
                        <span className="text-slate-700 dark:text-gray-500 text-xs italic">
                          {moment(followerId.updatedAt).fromNow()}
                        </span>
                      </div>
                      <div className="flex gap-1 items-center cursor-pointer">
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
                          Xóa
                        </span>
                      </div>
                    </div>

                    <span className="text-sm text-gray-700 dark:text-slate-500">
                      {/* {followerId} */}
                    </span>
                  </div>
                </div>
              ))}
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

export default Followers;
